import { invoke } from '@tauri-apps/api/core';
import {
  HoyoGame,
  HoyoBackground,
  HoyoBanner,
  HoyoPost,
  HoyoPackageInfo,
  HoyoGamePackageResult,
  Region,
} from '../types';

export const REGION_CONFIGS: Record<Region, { baseUrl: string; launcherId: string; name: string }> = {
  os: {
    baseUrl: 'https://sg-hyp-api.hoyoverse.com/hyp/hyp-connect/api',
    launcherId: 'VYTpXlbWo8',
    name: 'Global (HoYoverse)',
  },
  cn: {
    baseUrl: 'https://hyp-api.mihoyo.com/hyp/hyp-connect/api',
    launcherId: 'jGHBHlcOq1',
    name: 'China (miHoYo)',
  },
};

// Safe API caller using Rust Tauri invoke or fallback to fetch
async function callApi<T>(url: string): Promise<T> {
  try {
    const raw = await invoke<string>('fetch_hoyo_api', { url });
    const parsed = JSON.parse(raw);
    if (parsed.retcode !== 0) {
      throw new Error(parsed.message || `API error code ${parsed.retcode}`);
    }
    return parsed.data;
  } catch (err) {
    // If running outside Tauri or invoke fails, fallback to fetch
    const res = await fetch(url);
    const parsed = await res.json();
    if (parsed.retcode !== 0) {
      throw new Error(parsed.message || `API error code ${parsed.retcode}`);
    }
    return parsed.data;
  }
}

export async function fetchGames(region: Region, language: string): Promise<HoyoGame[]> {
  const { baseUrl, launcherId } = REGION_CONFIGS[region];
  const url = `${baseUrl}/getGames?launcher_id=${launcherId}&language=${language}`;
  const data = await callApi<{ games: HoyoGame[] }>(url);
  return data.games || [];
}

export async function fetchGameBackgrounds(
  region: Region,
  language: string,
  gameId: string
): Promise<HoyoBackground[]> {
  const { baseUrl, launcherId } = REGION_CONFIGS[region];
  const url = `${baseUrl}/getAllGameBasicInfo?launcher_id=${launcherId}&language=${language}&game_id=${gameId}`;
  const data = await callApi<{ game_info_list: Array<{ backgrounds: HoyoBackground[] }> }>(url);
  return data?.game_info_list?.[0]?.backgrounds || [];
}

export async function fetchGameContent(
  region: Region,
  language: string,
  gameId: string
): Promise<{ banners: HoyoBanner[]; posts: HoyoPost[] }> {
  const { baseUrl, launcherId } = REGION_CONFIGS[region];
  const url = `${baseUrl}/getGameContent?launcher_id=${launcherId}&language=${language}&game_id=${gameId}`;
  const data = await callApi<{
    content: {
      banners: HoyoBanner[];
      posts: HoyoPost[];
    };
  }>(url);
  return {
    banners: data?.content?.banners || [],
    posts: data?.content?.posts || [],
  };
}

export async function fetchGamePackages(
  region: Region,
  language: string,
  gameId: string
): Promise<HoyoGamePackageResult> {
  const { baseUrl, launcherId } = REGION_CONFIGS[region];
  const url = `${baseUrl}/getGamePackages?launcher_id=${launcherId}&language=${language}`;
  const data = await callApi<{
    game_packages: Array<{
      game: { id: string };
      main?: { major?: HoyoPackageInfo; patches?: HoyoPackageInfo[] };
      pre_download?: { major?: HoyoPackageInfo; patches?: HoyoPackageInfo[] };
    }>;
  }>(url);

  const matched = data?.game_packages?.find((pkg) => pkg.game?.id === gameId);
  if (!matched) {
    return {
      main: null,
      patches: [],
      pre_download: null,
    };
  }

  const hasPreDownload =
    Boolean(matched.pre_download?.major) ||
    Boolean(matched.pre_download?.patches && matched.pre_download.patches.length > 0);

  return {
    main: matched.main?.major || null,
    patches: matched.main?.patches || [],
    pre_download: hasPreDownload
      ? {
          major: matched.pre_download?.major || null,
          patches: matched.pre_download?.patches || [],
        }
      : null,
  };
}
