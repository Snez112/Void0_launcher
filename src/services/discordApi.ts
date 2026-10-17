import { invoke } from '@tauri-apps/api/core';

export const DEFAULT_LAUNCHER_ICON_URL =
  'https://cdn.discordapp.com/app-icons/1560064075764080770/2163eb6538a7581a55bc4b3c2199136a.png';

export async function setDiscordPresence(
  gameName: string,
  details: string,
  state: string,
  gameIconUrl?: string,
  smallText?: string,
  launcherIcon?: string
): Promise<void> {
  try {
    await invoke('discord_update_presence', {
      customClientId: null,
      gameName,
      details,
      state,
      largeImage: gameIconUrl || null,
      largeText: gameName,
      smallImage: launcherIcon || DEFAULT_LAUNCHER_ICON_URL,
      smallText: smallText || 'AIO Launcher',
    });
  } catch (err) {
    console.debug('Discord RPC error:', err);
  }
}

export function getGameWebIconUrl(biz: string, localIcon?: string): string {
  if (localIcon && localIcon.startsWith('http')) {
    return localIcon;
  }
  const lower = biz.toLowerCase();
  if (lower.includes('nap') || lower.includes('zzz') || lower.includes('zenless')) {
    return 'https://fastcdn.hoyoverse.com/content-v2/nap/101897/a511ff34fa9635fc777a829141d06b3e_2593684279549323164.png';
  }
  if (lower.includes('hkrpg')) {
    return 'https://fastcdn.hoyoverse.com/content-v2/hkrpg/102029/c5664188b8fa8b31a5ebcc903561a007_6324887309990575306.png';
  }
  if (lower.includes('hk4e')) {
    return 'https://fastcdn.hoyoverse.com/content-v2/hk4e/102008/7864f19fd7e3e9d8e7c10b78df1066cb_1033230691745479361.png';
  }
  if (lower.includes('bh3')) {
    return 'https://fastcdn.hoyoverse.com/content-v2/bh3/102030/14f24ef78c8bc90666993a401c385c7a_4855964893796677937.png';
  }
  if (lower.includes('endfield')) {
    return 'https://patchwiki.biligame.com/images/zmd/4/43/t8b9iaomf3iui6ct7w96u83htis4zj0.png';
  }
  return '';
}
