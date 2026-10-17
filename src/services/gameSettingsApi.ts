import { invoke } from '@tauri-apps/api/core';
import { GameGraphicsConfig } from '../types';

export async function getGameGraphicsSettings(gameBiz: string): Promise<GameGraphicsConfig> {
  return await invoke('get_game_graphics_settings', { gameBiz });
}

export async function getSystemResolutions(): Promise<Array<{ width: number; height: number }>> {
  return await invoke('get_system_resolutions');
}

export async function saveGameGraphicsSettings(
  gameBiz: string,
  config: GameGraphicsConfig
): Promise<void> {
  await invoke('save_game_graphics_settings', { gameBiz, config });
}

export async function launchGameAdvanced(
  exePath: string,
  config: GameGraphicsConfig,
  forceDx12: boolean,
  gameBiz?: string
): Promise<void> {
  await invoke('launch_game_advanced', {
    exePath,
    config,
    forceDx12,
    gameBiz: gameBiz || null,
  });
}
