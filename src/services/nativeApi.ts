import { invoke } from '@tauri-apps/api/core';
import {
  getCurrentWindow,
  LogicalSize,
  LogicalPosition,
  currentMonitor,
} from '@tauri-apps/api/window';

export async function windowStartDragging(): Promise<void> {
  try {
    await invoke('window_start_dragging');
  } catch {
    await getCurrentWindow().startDragging();
  }
}

export async function windowMinimize(): Promise<void> {
  try {
    await invoke('window_minimize');
  } catch (err) {
    console.warn('invoke window_minimize failed, falling back to getCurrentWindow:', err);
    try {
      await getCurrentWindow().minimize();
    } catch (e) {
      console.error('getCurrentWindow minimize failed:', e);
    }
  }
}

export async function windowToggleMaximize(): Promise<void> {
  try {
    await invoke('window_toggle_maximize');
  } catch (err) {
    console.warn('invoke window_toggle_maximize failed, falling back to getCurrentWindow:', err);
    try {
      const win = getCurrentWindow();
      const isMax = await win.isMaximized();
      if (isMax) {
        await win.unmaximize();
      } else {
        await win.maximize();
      }
    } catch (e) {
      console.error('getCurrentWindow toggleMaximize failed:', e);
    }
  }
}

export async function windowClose(): Promise<void> {
  try {
    await invoke('window_close');
  } catch (err) {
    console.warn('invoke window_close failed, falling back to getCurrentWindow:', err);
    try {
      await getCurrentWindow().close();
    } catch (e) {
      console.error('getCurrentWindow close failed:', e);
    }
  }
}

export async function pickGameFile(): Promise<string | null> {
  return await invoke<string | null>('pick_game_file');
}

export async function pickGameFolder(): Promise<string | null> {
  return await invoke<string | null>('pick_game_folder');
}

export async function getLocalGameVersion(gamePath: string, gameBiz: string): Promise<string | null> {
  return await invoke<string | null>('get_local_game_version', { gamePath, gameBiz });
}

export async function launchGame(exePath: string, gameBiz?: string): Promise<void> {
  await invoke('launch_game', { exePath, gameBiz });
}

export async function isGameRunning(gamePath: string, gameBiz: string): Promise<boolean> {
  return await invoke<boolean>('is_game_running', { gamePath, gameBiz });
}

export async function openFolder(dirPath: string): Promise<void> {
  await invoke('open_folder', { dirPath });
}

export async function getOfficialLauncherPath(gamePath: string, gameBiz: string): Promise<string | null> {
  try {
    return await invoke<string | null>('get_official_launcher_path', { gamePath, gameBiz });
  } catch {
    return null;
  }
}

export async function openOfficialLauncher(gamePath: string, gameBiz: string): Promise<boolean> {
  try {
    return await invoke<boolean>('open_official_launcher', { gamePath, gameBiz });
  } catch {
    return false;
  }
}

export async function toggleOverlay(targetUrl?: string): Promise<boolean> {
  try {
    return await invoke<boolean>('toggle_overlay', { targetUrl: targetUrl || null });
  } catch {
    return false;
  }
}

export async function isOverlayVisible(): Promise<boolean> {
  try {
    return await invoke<boolean>('is_overlay_visible');
  } catch {
    return false;
  }
}

export async function setOverlayMode(mode: 'mini' | 'full', size?: number): Promise<void> {
  const win = getCurrentWindow();
  try {
    if (mode === 'mini') {
      const dim = size || 340;
      await win.setSize(new LogicalSize(dim, dim));
    } else {
      await win.setSize(new LogicalSize(1120, 740));
      await win.center();
    }
  } catch (e) {
    console.warn('Frontend resize failed, falling back to backend:', e);
  }

  try {
    await invoke('set_overlay_mode', { mode, size: size || null });
  } catch (e) {
    console.warn('Backend set_overlay_mode failed:', e);
  }
}

export async function setOverlayCorner(corner: 'top-left' | 'top-right', windowSize = 340): Promise<void> {
  try {
    const win = getCurrentWindow();
    if (corner === 'top-left') {
      await win.setPosition(new LogicalPosition(24, 24));
    } else {
      const monitor = await currentMonitor();
      if (monitor) {
        const scale = monitor.scaleFactor;
        const screenW = monitor.size.width / scale;
        const x = Math.max(20, screenW - windowSize - 24);
        await win.setPosition(new LogicalPosition(x, 24));
      } else {
        await win.setPosition(new LogicalPosition(1500, 24));
      }
    }
  } catch (e) {
    console.warn('setOverlayCorner failed:', e);
  }
}

export async function setOverlayClickThrough(clickThrough: boolean): Promise<void> {
  try {
    await invoke('set_overlay_click_through', { clickThrough });
  } catch (e) {
    console.error('Lỗi đổi chế độ xuyên chuột:', e);
  }
}
