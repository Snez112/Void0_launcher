import { invoke } from '@tauri-apps/api/core';
import { getCurrentWindow } from '@tauri-apps/api/window';

export async function windowStartDragging(): Promise<void> {
  try {
    await invoke('window_start_dragging');
  } catch {
    await getCurrentWindow().startDragging();
  }
}

export async function windowMinimize(): Promise<void> {
  await invoke('window_minimize');
}

export async function windowToggleMaximize(): Promise<void> {
  await invoke('window_toggle_maximize');
}

export async function windowClose(): Promise<void> {
  await invoke('window_close');
}

export async function pickGameFile(): Promise<string | null> {
  return await invoke<string | null>('pick_game_file');
}

export async function launchGame(exePath: string): Promise<void> {
  await invoke('launch_game', { exePath });
}

export async function openFolder(dirPath: string): Promise<void> {
  await invoke('open_folder', { dirPath });
}
