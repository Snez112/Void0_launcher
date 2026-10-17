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
  gameLaunchArgs?: Record<string, string>; // game_id -> custom command line args
  gameBorderless?: Record<string, boolean>; // game_id -> borderless window
  gameForceDx12?: Record<string, boolean>; // game_id -> DX12
}

export interface HsrGraphicsSettings {
  FPS: number; // 30, 60, 120
  EnableVSync: boolean;
  RenderScale: number; // 0.8 to 2.0
  ResolutionQuality: number; // 1 to 5
  ShadowQuality: number;
  LightQuality: number;
  CharacterQuality: number;
  EnvDetailQuality: number;
  ReflectionQuality: number;
  SFXQuality: number;
  BloomQuality: number;
  AAMode: number; // 0: Off, 1: TAA, 2: FXAA
  DlssQuality: number; // 0: Off, 1: Ultra Perf, 2: Perf, 3: Balanced, 4: Quality, 5: DLAA
}

export interface GameGraphicsConfig {
  width: number;
  height: number;
  fullscreen_mode: number; // 1: Fullscreen, 3: Windowed
  borderless: boolean;
  custom_args: string;
  hsr_graphics?: HsrGraphicsSettings | null;
}

export interface CheckinStatus {
  is_sign: boolean;
  total_sign_day: number;
  today: string;
}
