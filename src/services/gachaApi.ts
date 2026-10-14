import { invoke } from '@tauri-apps/api/core';

export interface StarwardGachaItem {
  uid: number;
  id: number;
  name: string;
  time: string;
  item_id: number;
  item_type: string;
  rank_type: number;
  gacha_type: number;
  gacha_id?: number | null;
  count: number;
  lang?: string | null;
  pity: number;
  icon?: string | null;
}

export interface FiveStarItem {
  name: string;
  item_type: string;
  time: string;
  pity: number;
  gacha_type: number;
  icon?: string | null;
}

export interface UidOption {
  uid: number;
  nickname?: string | null;
}

export interface BannerStats {
  gacha_type: number;
  gacha_name: string;
  total_pulls: number;
  current_pity: number;
  five_star_count: number;
  four_star_count: number;
  three_star_count: number;
  ratio_5: number;
  ratio_4: number;
  average_5: number;
  five_stars: FiveStarItem[];
}

export interface GachaOverview {
  db_path: string;
  total_pulls: number;
  uids: UidOption[];
  selected_uid: number | null;
  banners: BannerStats[];
  recent_records: StarwardGachaItem[];
}

export async function detectGachaCacheUrl(gameBiz: string, gameExe: string): Promise<string> {
  return await invoke<string>('gacha_detect_cache_url', { gameBiz, gameExe });
}

export async function importGachaRecords(gachaUrl: string, gameBiz: string): Promise<number> {
  return await invoke<number>('gacha_import_records', { gachaUrl, gameBiz });
}

export async function getGachaOverview(gameBiz: string, uid?: number | null): Promise<GachaOverview> {
  return await invoke<GachaOverview>('gacha_get_overview', { gameBiz, uid: uid ?? null });
}

export async function getGachaDbPath(): Promise<string> {
  return await invoke<string>('gacha_get_db_path');
}
