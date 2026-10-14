import {
  HoyoGame,
  HoyoBackground,
  HoyoBanner,
  HoyoPost,
  HoyoGamePackageResult,
  Region,
} from '../types';
import endfieldIcon from '../assets/endfield-icon.svg';
import endfieldLogo from '../assets/endfield-logo.svg';

export const ENDFIELD_GAME_ID = 'endfield_game_id';
export const ENDFIELD_BIZ = 'endfield_global';

export function getEndfieldGameDef(language: string): HoyoGame {
  const isZh = language.toLowerCase().includes('zh');
  const isVi = language.toLowerCase().includes('vi');

  return {
    id: ENDFIELD_GAME_ID,
    biz: ENDFIELD_BIZ,
    display: {
      language,
      name: isZh ? '明日方舟：终末地' : 'Arknights: Endfield',
      icon: {
        url: endfieldIcon,
      },
      title: isZh ? '明日方舟：终末地' : 'Arknights: Endfield',
      subtitle: isZh
        ? '跨越边境，开拓前线'
        : 'Over the Frontier, Into the Front',
      background: {
        url: 'https://gl-utils-public.hg-cdn.com/hg-utils/prod/eppcsuwqpaueijqk/YDUTE5gscDZ229CW/56/db/56dbf737e92191d5414241f5913792cf.webp',
      },
      logo: {
        url: endfieldLogo,
      },
      thumbnail: {
        url: endfieldIcon,
      },
      wpf_icon: {
        url: endfieldIcon,
      },
      introduction: isZh
        ? '《明日方舟：终末地》是鹰角网络自主研发并发行的3D即时策略RPG游戏。'
        : isVi
        ? 'Arknights: Endfield là tựa game 3D RPG chiến thuật thời gian thực thế giới mở được phát triển bởi Hypergryph và phát hành toàn cầu bởi GRYPHLINE.'
        : 'Arknights: Endfield is a real-time tactical 3D RPG developed by Hypergryph and published globally by GRYPHLINE.',
    },
    display_status: 'DISPLAY_STATUS_NORMAL',
  };
}

export const ENDFIELD_GAME_DEF: HoyoGame = getEndfieldGameDef('vi-vn');

// Map regional configurations
const ENDFIELD_CONFIG = {
  os: {
    appCode: 'YDUTE5gscDZ229CW',
    channel: 6,
    subChannel: 6,
    batchProxyUrl: 'https://launcher.gryphline.com/api/proxy/web/batch_proxy',
    latestUrl: 'https://launcher.gryphline.com/api/game/get_latest?appcode=YDUTE5gscDZ229CW&launcher_appcode=TiaytKBUIEdoEwRT&channel=6&sub_channel=6&launcher_sub_channel=6',
  },
  cn: {
    appCode: '6LL0KJuqHBVz33WK',
    channel: 1,
    subChannel: 1,
    batchProxyUrl: 'https://launcher.hypergryph.com/api/proxy/web/batch_proxy',
    latestUrl: 'https://launcher.hypergryph.com/api/game/get_latest?appcode=6LL0KJuqHBVz33WK&launcher_appcode=abYeZZ16BPluCFyT&channel=1&sub_channel=1&launcher_sub_channel=1',
  },
};

export async function fetchEndfieldBackgrounds(region: Region, language: string): Promise<HoyoBackground[]> {
  const cfg = ENDFIELD_CONFIG[region] || ENDFIELD_CONFIG.os;
  const reqLang = language.toLowerCase().includes('zh') ? 'zh-cn' : language.toLowerCase().includes('vi') ? 'vi-vn' : 'en-us';

  try {
    const res = await fetch(cfg.batchProxyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        proxy_reqs: [
          {
            kind: 'get_main_bg_image',
            get_main_bg_image_req: {
              appcode: cfg.appCode,
              channel: String(cfg.channel),
              sub_channel: String(cfg.subChannel),
              language: reqLang,
              platform: 'Windows',
              source: 'launcher',
            },
          },
        ],
      }),
    });

    const data = await res.json();
    const bgData = data?.proxy_rsps?.[0]?.get_main_bg_image_rsp?.main_bg_image;
    if (bgData) {
      return [
        {
          id: 'endfield_bg',
          type: 'BACKGROUND_TYPE_VIDEO',
          background: bgData.url ? { url: bgData.url, link: 'https://endfield.gryphline.com' } : undefined,
          video: bgData.video_url ? { url: bgData.video_url, size: 0 } : undefined,
        },
      ];
    }
  } catch (err) {
    console.error('Lỗi tải hình nền Endfield:', err);
  }

  // Fallback defaults
  return [
    {
      id: 'endfield_bg_default',
      type: 'BACKGROUND_TYPE_VIDEO',
      background: {
        url: 'https://gl-utils-public.hg-cdn.com/hg-utils/prod/eppcsuwqpaueijqk/YDUTE5gscDZ229CW/56/db/56dbf737e92191d5414241f5913792cf.webp',
        link: 'https://endfield.gryphline.com',
      },
      video: {
        url: 'https://gl-utils-public.hg-cdn.com/hg-utils/prod/eppcsuwqpaueijqk/YDUTE5gscDZ229CW/96/b5/96b543cae04aaf6fe69e795c86602536.mp4',
        size: 0,
      },
    },
  ];
}

export async function fetchEndfieldContent(
  region: Region,
  language: string
): Promise<{ banners: HoyoBanner[]; posts: HoyoPost[] }> {
  const cfg = ENDFIELD_CONFIG[region] || ENDFIELD_CONFIG.os;
  const reqLang = language.toLowerCase().includes('zh') ? 'zh-cn' : language.toLowerCase().includes('vi') ? 'vi-vn' : 'en-us';

  try {
    const res = await fetch(cfg.batchProxyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        proxy_reqs: [
          {
            kind: 'get_banner',
            get_banner_req: {
              appcode: cfg.appCode,
              channel: String(cfg.channel),
              sub_channel: String(cfg.subChannel),
              language: reqLang,
              platform: 'Windows',
              source: 'launcher',
            },
          },
          {
            kind: 'get_announcement',
            get_announcement_req: {
              appcode: cfg.appCode,
              channel: String(cfg.channel),
              sub_channel: String(cfg.subChannel),
              language: reqLang,
              platform: 'Windows',
              source: 'launcher',
            },
          },
        ],
      }),
    });

    const data = await res.json();
    const bannerRsp = data?.proxy_rsps?.find((p: any) => p.kind === 'get_banner')?.get_banner_rsp;
    const announceRsp = data?.proxy_rsps?.find((p: any) => p.kind === 'get_announcement')?.get_announcement_rsp;

    const banners: HoyoBanner[] = (bannerRsp?.banners || []).map((b: any) => ({
      id: b.id || String(Math.random()),
      image: {
        url: b.url,
        link: b.jump_url,
      },
    }));

    const posts: HoyoPost[] = [];
    if (announceRsp?.tabs) {
      for (const tab of announceRsp.tabs) {
        for (const item of tab.announcements || []) {
          posts.push({
            id: item.id || String(Math.random()),
            type: tab.tabName === 'Notices' ? 'POST_TYPE_ANNOUNCE' : tab.tabName === 'Events' ? 'POST_TYPE_ACTIVITY' : 'POST_TYPE_INFO',
            title: item.content,
            link: item.jump_url,
            date: item.start_ts ? new Date(Number(item.start_ts)).toLocaleDateString() : 'Mới nhất',
          });
        }
      }
    }

    return { banners, posts };
  } catch (err) {
    console.error('Lỗi tải tin tức Endfield:', err);
    return { banners: [], posts: [] };
  }
}

export async function fetchEndfieldPackages(region: Region): Promise<HoyoGamePackageResult> {
  const cfg = ENDFIELD_CONFIG[region] || ENDFIELD_CONFIG.os;

  try {
    const res = await fetch(cfg.latestUrl);
    const data = await res.json();

    const packs = data?.pkg?.packs || [];
    const gamePkgs = packs.map((p: any) => ({
      url: p.url,
      md5: p.md5,
      size: String(p.package_size),
      decompressed_size: String(p.package_size),
    }));

    const mainPkg = {
      version: data.version || '1.6.3',
      game_pkgs: gamePkgs,
      audio_pkgs: [],
    };

    return {
      main: mainPkg,
      patches: [],
      pre_download: null,
    };
  } catch (err) {
    console.error('Lỗi tải gói cài đặt Endfield:', err);
    return {
      main: null,
      patches: [],
      pre_download: null,
    };
  }
}
