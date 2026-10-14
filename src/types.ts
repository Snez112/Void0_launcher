export interface HoyoGame {
  id: string;
  biz: string;
  display: {
    language: string;
    name: string;
    icon: { url: string };
    title: string;
    subtitle: string;
    background: { url: string };
    logo: { url: string };
    thumbnail: { url: string };
    wpf_icon: { url: string };
    introduction: string;
  };
  display_status: string;
}

export interface HoyoBackground {
  id: string;
  type: string;
  background?: { url: string; link: string };
  video?: { url: string; size: number };
  theme?: { url: string; link: string };
  icon?: { url: string; link: string; hover_url: string };
}

export interface HoyoBanner {
  id: string;
  image: {
    url: string;
    link: string;
  };
}

export interface HoyoPost {
  id: string;
  type: 'POST_TYPE_INFO' | 'POST_TYPE_ANNOUNCE' | 'POST_TYPE_ACTIVITY' | string;
  title: string;
  link: string;
  date: string;
}

export interface GamePkg {
  url: string;
  md5: string;
  size: string;
  decompressed_size: string;
}

export interface AudioPkg {
  language: string;
  url: string;
  md5: string;
  size: string;
}

export interface HoyoPackageInfo {
  version: string;
  game_pkgs: GamePkg[];
  audio_pkgs: AudioPkg[];
  res_list_url?: string;
}

export interface HoyoGamePackageResult {
  main: HoyoPackageInfo | null;
  patches: HoyoPackageInfo[];
  pre_download: {
    major: HoyoPackageInfo | null;
    patches: HoyoPackageInfo[];
  } | null;
}

export type Region = 'os' | 'cn';

export interface AppConfig {
  region: Region;
  language: string;
  soundEnabled: boolean;
  gamePaths: Record<string, string>; // game_id -> executable path
  cookie: string; // HoYoLAB Cookie
  autoCheckin: boolean; // Auto check-in on app launch
  discordClientId?: string; // Optional custom Discord App ID
}

export interface CheckinStatus {
  is_sign: boolean;
  total_sign_day: number;
  today: string;
}
