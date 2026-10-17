import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  RotateCw,
  ExternalLink,
  Settings,
  Maximize2,
  Minimize2,
  Check,
  Compass,
  ZoomIn,
  ZoomOut,
  MousePointer,
  Move,
  Radio,
} from 'lucide-react';
import { listen } from '@tauri-apps/api/event';
import { openUrl } from '@tauri-apps/plugin-opener';
import {
  toggleOverlay,
  windowStartDragging,
  setOverlayMode,
  setOverlayClickThrough,
  setOverlayCorner,
} from '../../services/nativeApi';
import './OverlayApp.css';

interface MapOption {
  id: string;
  name: string;
  shortName: string;
  game: string;
  url: string;
}

const MAP_OPTIONS: MapOption[] = [
  {
    id: 'a9e_skport',
    name: 'SKPort Map (Chính thức Gryphline)',
    shortName: 'SKPort Official',
    game: 'Arknights: Endfield',
    url: 'https://game.skport.com/map/endfield',
  },
  {
    id: 'a9e_gg',
    name: 'Endfield.GG Map (Cộng đồng)',
    shortName: 'Endfield.GG',
    game: 'Arknights: Endfield',
    url: 'https://endfield.gg/map/',
  },
  {
    id: 'hsr_hoyolab',
    name: 'Honkai: Star Rail',
    shortName: 'Star Rail',
    game: 'Honkai: Star Rail',
    url: 'https://act.hoyolab.com/sr/app/interactive-map/index.html',
  },
  {
    id: 'genshin_hoyolab',
    name: 'Genshin Impact',
    shortName: 'Genshin',
    game: 'Genshin Impact',
    url: 'https://act.hoyolab.com/ys/app/interactive-map/index.html',
  },
  {
    id: 'zzz_hoyolab',
    name: 'Zenless Zone Zero',
    shortName: 'ZZZ',
    game: 'Zenless Zone Zero',
    url: 'https://act.hoyolab.com/zzz/app/interactive-map/index.html',
  },
];

const RADAR_SIZES = [
  { label: 'Nhỏ', value: 270, windowSize: 290 },
  { label: 'Vừa', value: 330, windowSize: 350 },
  { label: 'Lớn', value: 390, windowSize: 410 },
];

export const OverlayApp: React.FC = () => {
  const [mode, setMode] = useState<'mini' | 'full'>('mini');
  const [winWidth, setWinWidth] = useState<number>(window.innerWidth);
  const [selectedMapId, setSelectedMapId] = useState<string>('a9e_skport');
  const [hudShape, setHudShape] = useState<'squircle' | 'circle'>('squircle');
  const [corner, setCorner] = useState<'top-left' | 'top-right'>('top-left');
  const [radarSizeIndex, setRadarSizeIndex] = useState<number>(1); // Default Vừa (350px)
  const [radarZoom, setRadarZoom] = useState<number>(1.0); // Radar scale (1.0 = standard)
  const [mapOffsetX, setMapOffsetX] = useState<number>(-720); // Desktop offset to center Location Sync
  const [mapOffsetY, setMapOffsetY] = useState<number>(-325); // Desktop offset to center Location Sync
  const [showChevron, setShowChevron] = useState<boolean>(true); // Center player pointer
  const [opacity, setOpacity] = useState<number>(95);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [clickThrough, setClickThrough] = useState<boolean>(false);
  const [panMapMode, setPanMapMode] = useState<boolean>(false);
  const [quickSyncView, setQuickSyncView] = useState<boolean>(false);
  const [iframeKey, setIframeKey] = useState<number>(1);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentMap = MAP_OPTIONS.find((m) => m.id === selectedMapId) || MAP_OPTIONS[0];
  const activeRadarSize = RADAR_SIZES[radarSizeIndex];

  // Auto-Sync helper: directly interacts with SKPort DOM (enabled via --disable-web-security)
  const attemptAutoSync = useCallback((): boolean => {
    if (selectedMapId !== 'a9e_skport') return false;
    try {
      const iframe = iframeRef.current;
      if (!iframe) return false;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) return false;

      // 1. Locate PointSwitch ToggleGroup
      let toggleGroup = doc.querySelector<HTMLElement>('[class*="PointSwitch__ToggleGroup"]');
      let onSpan: HTMLElement | undefined;

      if (!toggleGroup) {
        const elements = Array.from(doc.querySelectorAll('div, button, span'));
        onSpan = elements.find((el) => {
          const txt = el.textContent?.trim();
          return txt === 'ON' || txt === '开';
        }) as HTMLElement;

        if (onSpan) {
          toggleGroup =
            onSpan.closest<HTMLElement>('[class*="ToggleGroup"]') ||
            (onSpan.parentElement?.parentElement as HTMLElement) ||
            (onSpan.parentElement as HTMLElement);
        }
      } else {
        const spans = Array.from(toggleGroup.querySelectorAll('span'));
        onSpan = spans.find((s) => {
          const txt = s.textContent?.trim();
          return txt === 'ON' || txt === '开';
        });
      }

      if (!toggleGroup) return false;

      // 2. Check if already active
      const locationIcon = doc.querySelector<HTMLElement>('[class*="PointSwitch__LocationIcon"]');
      const isIconVisible =
        locationIcon &&
        window.getComputedStyle(locationIcon).display !== 'none' &&
        window.getComputedStyle(locationIcon).visibility !== 'hidden';

      const isAlreadyOn =
        isIconVisible ||
        toggleGroup.className.includes('active') ||
        (onSpan && (onSpan.className.includes('active') || onSpan.parentElement?.className.includes('active')));

      if (!isAlreadyOn) {
        console.log('[Overlay Radar] Tự động bật Location Sync...');
        if (onSpan) {
          onSpan.click();
        } else {
          toggleGroup.click();
        }
        return true;
      }
      return true;
    } catch (e) {
      console.warn('[Overlay Radar] Không thể truy cập DOM iframe:', e);
      return false;
    }
  }, [selectedMapId]);

  // Poll for Location Sync switch until it connects
  const startAutoSyncPolling = useCallback(() => {
    if (selectedMapId !== 'a9e_skport') return;
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }

    let attempts = 0;
    pollTimerRef.current = setInterval(() => {
      attempts++;
      const done = attemptAutoSync();
      if (done || attempts >= 15) {
        if (pollTimerRef.current) {
          clearInterval(pollTimerRef.current);
          pollTimerRef.current = null;
        }
      }
    }, 800);
  }, [attemptAutoSync, selectedMapId]);

  // Set document transparent so transparent window works properly
  useEffect(() => {
    document.documentElement.style.background = 'transparent';
    document.body.style.background = 'transparent';
    const rootEl = document.getElementById('root');
    if (rootEl) {
      rootEl.style.background = 'transparent';
    }

    const handleResize = () => setWinWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync mode with Tauri window size and position
  const handleSetMode = async (newMode: 'mini' | 'full') => {
    setShowSettings(false);
    try {
      if (newMode === 'mini') {
        await setOverlayMode('mini', activeRadarSize.windowSize);
      } else {
        await setOverlayMode('full');
      }
    } catch (e) {
      console.warn('Resize failed:', e);
    }
    setMode(newMode);
  };

  // Change radar size
  const handleChangeRadarSize = async (index: number) => {
    setRadarSizeIndex(index);
    const target = RADAR_SIZES[index];
    if (mode === 'mini') {
      await setOverlayMode('mini', target.windowSize);
    }
  };

  // Change corner position
  const handleSetCorner = async (c: 'top-left' | 'top-right') => {
    setCorner(c);
    if (mode === 'mini') {
      await setOverlayCorner(c, activeRadarSize.windowSize);
    }
  };

  // Toggle click-through ghost mode
  const handleToggleClickThrough = async () => {
    const next = !clickThrough;
    setClickThrough(next);
    await setOverlayClickThrough(next);
  };

  // Global hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + M: Toggle overlay hide/show
      if (e.altKey && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        toggleOverlay();
        return;
      }

      // Alt + S: Toggle settings
      if (e.altKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        setShowSettings((prev) => !prev);
        return;
      }

      // Alt + F: Toggle Mini/Full mode
      if (e.altKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        handleSetMode(mode === 'mini' ? 'full' : 'mini');
        return;
      }

      // Alt + G: Toggle Ghost Mode (Click-Through)
      if (e.altKey && e.key.toLowerCase() === 'g') {
        e.preventDefault();
        handleToggleClickThrough();
        return;
      }

      // Escape: Close settings if open, otherwise return to mini mode or hide
      if (e.key === 'Escape') {
        e.preventDefault();
        if (showSettings) {
          setShowSettings(false);
        } else if (mode === 'full') {
          handleSetMode('mini');
        } else {
          toggleOverlay();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Initial resize to mini mode
    setOverlayMode('mini', activeRadarSize.windowSize);

    // Listen to global hotkey Alt + S from Rust
    const unlistenSettings = listen('toggle_overlay_settings', () => {
      if (clickThrough) {
        setClickThrough(false);
        setOverlayClickThrough(false);
      }
      setShowSettings((prev) => !prev);
    });

    // Listen for custom target URL sent from main window
    const unlistenMap = listen<string>('set_overlay_map', (event) => {
      const targetUrl = event.payload;
      if (targetUrl) {
        const found = MAP_OPTIONS.find((m) => m.url === targetUrl);
        if (found) {
          setSelectedMapId(found.id);
        }
      }
    });

    // Listen for overlay visibility toggle
    const unlistenVisibility = listen<boolean>('overlay_visibility_changed', (event) => {
      if (event.payload === true) {
        // Overlay shown: do not reload iframe to avoid killing active Location Sync session
      }
    });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      unlistenSettings.then((u) => u());
      unlistenMap.then((u) => u());
      unlistenVisibility.then((u) => u());
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
        pollTimerRef.current = null;
      }
    };
  }, [mode, showSettings, clickThrough, activeRadarSize]);

  const handleClose = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    toggleOverlay();
  };

  const handleReload = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIframeKey((prev) => prev + 1);
  };

  const handleOpenExternal = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      await openUrl(currentMap.url);
    } catch {
      window.open(currentMap.url, '_blank');
    }
  };

  const handleDragMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && !(e.target as HTMLElement).closest('button, select, input, a, [data-interactive="true"]')) {
      windowStartDragging();
    }
  };

  // Strictly guard: only render full layout if mode is full AND window has physically resized
  const isMini = mode === 'mini' || winWidth < 600;

  const effectiveOffsetX = quickSyncView
    ? -(1440 - activeRadarSize.value + 16)
    : mapOffsetX;
  const effectiveOffsetY = quickSyncView
    ? -(900 - activeRadarSize.value + 16)
    : mapOffsetY;
  const effectiveScale = quickSyncView ? 1.0 : radarZoom;
  const effectivePointerEvents = (quickSyncView || panMapMode) && !clickThrough ? 'auto' : 'none';

  return (
    <div className="overlay-root">
      <div className={isMini ? 'ef-minimap-container' : 'ef-fullmap-container'}>
        {/* 1. Header Area */}
        {isMini ? (
          <div
            className="ef-drag-header"
            onMouseDown={handleDragMouseDown}
            title="Kéo thanh này để di chuyển vị trí Mini Map trên màn hình"
          >
            <div className="ef-header-title">
              <div className="ef-grip-dots">
                <span className="ef-dot" />
                <span className="ef-dot" />
                <span className="ef-dot" />
              </div>
              <span className="ef-status-pulse" />
              <span>A9E RADAR</span>
            </div>

            <div className="ef-header-tools" data-interactive="true" onMouseDown={(e) => e.stopPropagation()}>
              {/* Quick Location Sync helper: toggles quick corner peek to flip switch right in Mini HUD */}
              <button
                type="button"
                className={`ef-tool-btn sync ${quickSyncView ? 'active' : ''}`}
                onClick={() => setQuickSyncView(!quickSyncView)}
                title={quickSyncView ? "Trở về tâm radar (Bấm lại để đóng)" : "Chuyển nhanh góc công tắc Location Sync để gạt ON/OFF ngay trên Mini HUD"}
              >
                <Radio size={11} />
                <span>{quickSyncView ? 'ĐANG BẬT' : 'SYNC'}</span>
              </button>

              {/* Pan Map vs Drag Window toggle */}
              <button
                type="button"
                className={`ef-tool-btn ${panMapMode ? 'active' : ''}`}
                onClick={() => setPanMapMode(!panMapMode)}
                title={panMapMode ? 'Đang bật Kéo Bản Đồ. Click để khóa lại' : 'Bật tương tác / Kéo bản đồ bằng chuột'}
              >
                <Move size={12} />
              </button>

              {/* Ghost Mode toggle */}
              <button
                type="button"
                className={`ef-tool-btn ${clickThrough ? 'active' : ''}`}
                onClick={handleToggleClickThrough}
                title={clickThrough ? 'Ghost Mode BẬT (Xuyên chuột). Alt+G để tắt' : 'Bật Ghost Mode (Alt+G)'}
              >
                <MousePointer size={12} />
              </button>

              {/* Settings toggle */}
              <button
                type="button"
                className={`ef-tool-btn ${showSettings ? 'active' : ''}`}
                onClick={() => setShowSettings(!showSettings)}
                title="Cài đặt & Tùy chỉnh (Alt+S)"
              >
                <Settings size={12} />
              </button>

              {/* Expand to Full Map */}
              <button
                type="button"
                className="ef-tool-btn"
                onClick={() => handleSetMode('full')}
                title="Phóng to toàn màn hình (Alt+F)"
              >
                <Maximize2 size={12} />
              </button>

              {/* Hide overlay */}
              <button
                type="button"
                className="ef-tool-btn close"
                onClick={handleClose}
                title="Ẩn Overlay (Alt+M)"
              >
                <X size={13} />
              </button>
            </div>
          </div>
        ) : (
          <div className="ef-fullmap-header-group">
            <div className="ef-fullmap-header" onMouseDown={handleDragMouseDown}>
              <div className="ef-fullmap-brand">
                <Compass size={16} color="var(--ef-yellow)" />
                <span className="ef-fullmap-title">A9E TACTICAL MAP</span>
                <span className="ef-fullmap-sub">TALOS-II</span>
              </div>

              {/* Map Switcher Pills */}
              <div
                className="ef-header-tools"
                data-interactive="true"
                onMouseDown={(e) => e.stopPropagation()}
              >
                {MAP_OPTIONS.slice(0, 2).map((opt) => {
                  const isSelected = opt.id === selectedMapId;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      className={`ef-badge-btn ${isSelected ? 'amber' : ''}`}
                      onClick={() => setSelectedMapId(opt.id)}
                    >
                      <span>{opt.shortName}</span>
                      {isSelected && <Check size={11} />}
                    </button>
                  );
                })}
              </div>

              {/* Header Right Actions */}
              <div
                className="ef-fullmap-actions"
                data-interactive="true"
                onMouseDown={(e) => e.stopPropagation()}
              >
                {/* Back to Mini Map button */}
                <button
                  type="button"
                  className="ef-badge-btn amber"
                  onClick={() => handleSetMode('mini')}
                  title="Thu nhỏ HUD (Alt+F)"
                >
                  <Minimize2 size={12} />
                  <span>THU NHỎ (Alt+F)</span>
                </button>

                <button
                  type="button"
                  className="ef-tool-btn"
                  onClick={handleReload}
                  title="Tải lại bản đồ"
                >
                  <RotateCw size={14} />
                </button>

                <button
                  type="button"
                  className="ef-tool-btn"
                  onClick={handleOpenExternal}
                  title="Mở trên trình duyệt ngoài"
                >
                  <ExternalLink size={14} />
                </button>

                <button
                  type="button"
                  className="ef-tool-btn close"
                  onClick={handleClose}
                  title="Đóng Overlay (Alt+M)"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Sync Guide Banner in Full Map */}
            {selectedMapId === 'a9e_skport' && (
              <div className="ef-fullmap-sync-bar">
                <Radio size={13} color="var(--ef-yellow-bright)" />
                <span>
                  <b>HƯỚNG DẪN BẬT SYNC:</b> 1. Đăng nhập tài khoản Gryphline (góc trên-phải) • 2. Gạt công tắc <b>Location Sync: ON</b> (góc dưới-phải) • 3. Bấm <b>THU NHỎ (Alt + F)</b> để về Mini Radar!
                </span>
              </div>
            )}
          </div>
        )}

        {/* 2. Persistent Viewport with Single Unchanging Iframe */}
        <div
          className={isMini ? `ef-minimap-viewport ${hudShape}` : 'ef-fullmap-iframe-box'}
          style={isMini ? { opacity: opacity / 100 } : undefined}
          onMouseDown={isMini && !panMapMode ? handleDragMouseDown : undefined}
        >
          {/* SINGLE PERSISTENT IFRAME: Never unmounted between Mini and Full modes */}
          <iframe
            key={`${currentMap.id}_${iframeKey}`}
            ref={iframeRef}
            src={currentMap.url}
            title={currentMap.name}
            className={isMini ? 'ef-minimap-iframe' : 'ef-fullmap-iframe'}
            onLoad={() => {
              // Tự động kích hoạt Location Sync khi iframe tải xong
              setTimeout(startAutoSyncPolling, 1000);
            }}
            style={
              isMini
                ? {
                    left: `${effectiveOffsetX}px`,
                    top: `${effectiveOffsetY}px`,
                    transform: `scale(${effectiveScale})`,
                    transformOrigin: `${-effectiveOffsetX + 165}px ${-effectiveOffsetY + 150}px`,
                    pointerEvents: effectivePointerEvents,
                  }
                : {
                    width: '100%',
                    height: '100%',
                    top: 0,
                    left: 0,
                    transform: 'none',
                    pointerEvents: 'auto',
                  }
            }
            allow="geolocation; fullscreen"
          />

          {/* Quick Location Sync corner switch banner */}
          {isMini && quickSyncView && (
            <div className="ef-quick-sync-banner" data-interactive="true" onMouseDown={(e) => e.stopPropagation()}>
              <div className="ef-quick-sync-title">
                <Radio size={12} color="var(--ef-yellow-bright)" />
                <span>GẠT [LOCATION SYNC: ON] BÊN DƯỚI</span>
              </div>
              <button
                type="button"
                className="ef-badge-btn amber"
                onClick={() => setQuickSyncView(false)}
              >
                <Check size={11} />
                <span>XONG (VỀ TÂM)</span>
              </button>
            </div>
          )}

          {isMini && !quickSyncView && (
            <>
              {/* Endfield In-Game HUD Reticle & Range Rings */}
              <div className="ef-hud-reticle-overlay">
                <div className="ef-range-ring" />
                <div className="ef-crosshair-h" />
                <div className="ef-crosshair-v" />
                {showChevron && <div className="ef-player-chevron" />}
              </div>

              {/* Endfield Tactical Corner Brackets (for Squircle Mode) */}
              {hudShape === 'squircle' && (
                <>
                  <div className="ef-corner-bracket ef-corner-tl" />
                  <div className="ef-corner-bracket ef-corner-tr" />
                  <div className="ef-corner-bracket ef-corner-bl" />
                  <div className="ef-corner-bracket ef-corner-br" />
                </>
              )}

              {/* North Compass Direction */}
              <div className="ef-compass-n">
                <span>▲</span>
                <span>N</span>
              </div>

              {/* Pan Mode Active Indicator */}
              {panMapMode && (
                <div className="ef-pan-mode-indicator">
                  <Move size={10} />
                  <span>CHẾ ĐỘ KÉO BẢN ĐỒ (BẬT)</span>
                </div>
              )}

              {/* Sleek Vertical Zoom Control Pill (Right edge) */}
              <div className="ef-hud-zoom-pill" data-interactive="true" onMouseDown={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  className="ef-zoom-btn"
                  onClick={() => setRadarZoom((z) => Math.min(2.5, Number((z + 0.2).toFixed(1))))}
                  title="Phóng to radar"
                >
                  <ZoomIn size={12} />
                </button>
                <span className="ef-zoom-val">{radarZoom}x</span>
                <button
                  type="button"
                  className="ef-zoom-btn"
                  onClick={() => setRadarZoom((z) => Math.max(0.7, Number((z - 0.2).toFixed(1))))}
                  title="Thu nhỏ radar"
                >
                  <ZoomOut size={12} />
                </button>
              </div>

              {/* Bottom HUD Tactical Readout */}
              <div className="ef-hud-footer">
                <span className="ef-hud-loc">TALOS-II // VALLEY-IV</span>
                <span className="ef-hud-scale">{Math.round(100 / radarZoom)}M</span>
              </div>
            </>
          )}
        </div>

        {/* 3. Mini Mode Compact Tactical Settings Modal */}
        {isMini && showSettings && (
          <div
            className="ef-mini-settings-modal"
            data-interactive="true"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="ef-mini-settings-header">
              <div className="ef-mini-settings-title">CÀI ĐẶT MINIMAP HUD</div>
              <button
                type="button"
                className="ef-tool-btn"
                onClick={() => setShowSettings(false)}
              >
                <X size={13} />
              </button>
            </div>

            {/* Location Sync Guide & Card */}
            <div className="ef-sync-card">
              <div className="ef-sync-card-title">
                <Radio size={13} color="var(--ef-yellow-bright)" />
                <span>ĐỒNG BỘ VỊ TRÍ GAME (LOCATION SYNC)</span>
              </div>
              <p className="ef-sync-card-desc">
                Tính năng chính thức của SKPort giúp Radar tự động bám theo nhân vật và hiện rương trong tầm.
              </p>
              <ol className="ef-sync-steps">
                <li>Mở game <b>Arknights: Endfield</b> và đăng nhập.</li>
                <li>Nhấn nút bên dưới (hoặc <b>Alt + F</b>), đăng nhập tài khoản Gryphline và gạt <b>Location Sync: ON</b> ở góc dưới-phải bản đồ.</li>
                <li>Nhấn <b>Alt + F</b> thu nhỏ lại — Radar sẽ tự động bám theo nhân vật!</li>
              </ol>
              <button
                type="button"
                className="ef-badge-btn amber"
                style={{ justifyContent: 'center', marginTop: '4px' }}
                onClick={() => handleSetMode('full')}
              >
                <Maximize2 size={12} />
                <span>MỞ FULL MAP ĐỂ BẬT SYNC (Alt + F)</span>
              </button>
            </div>

            {/* HUD Shape */}
            <div className="ef-setting-row">
              <span className="ef-setting-label">Kiểu Dáng HUD:</span>
              <div className="ef-btn-group">
                <button
                  type="button"
                  className={`ef-btn-group-btn ${hudShape === 'squircle' ? 'active' : ''}`}
                  onClick={() => setHudShape('squircle')}
                >
                  Chuẩn Endfield
                </button>
                <button
                  type="button"
                  className={`ef-btn-group-btn ${hudShape === 'circle' ? 'active' : ''}`}
                  onClick={() => setHudShape('circle')}
                >
                  Radar Tròn
                </button>
              </div>
            </div>

            {/* Corner Placement */}
            <div className="ef-setting-row">
              <span className="ef-setting-label">Vị Trí Góc Màn Hình:</span>
              <div className="ef-btn-group">
                <button
                  type="button"
                  className={`ef-btn-group-btn ${corner === 'top-left' ? 'active' : ''}`}
                  onClick={() => handleSetCorner('top-left')}
                >
                  Góc Trên-Trái
                </button>
                <button
                  type="button"
                  className={`ef-btn-group-btn ${corner === 'top-right' ? 'active' : ''}`}
                  onClick={() => handleSetCorner('top-right')}
                >
                  Góc Trên-Phải
                </button>
              </div>
            </div>

            {/* HUD Size */}
            <div className="ef-setting-row">
              <span className="ef-setting-label">Kích Thước:</span>
              <div className="ef-btn-group">
                {RADAR_SIZES.map((sz, i) => (
                  <button
                    key={sz.label}
                    type="button"
                    className={`ef-btn-group-btn ${radarSizeIndex === i ? 'active' : ''}`}
                    onClick={() => handleChangeRadarSize(i)}
                  >
                    {sz.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Center Nudge & Reset */}
            <div className="ef-setting-row">
              <div className="ef-setting-label">
                <span>Căn chỉnh tâm bản đồ:</span>
                <button
                  type="button"
                  className="ef-btn-text-link"
                  onClick={() => {
                    setMapOffsetX(-720);
                    setMapOffsetY(-325);
                    setRadarZoom(1.0);
                  }}
                  title="Đặt lại vị trí chuẩn Location Sync"
                >
                  Tâm Location Sync
                </button>
              </div>
              <div className="ef-btn-group">
                <button
                  type="button"
                  className="ef-btn-group-btn"
                  onClick={() => setMapOffsetX((x) => x + 40)}
                  title="Dịch bản đồ sang phải"
                >
                  ← Trái
                </button>
                <button
                  type="button"
                  className="ef-btn-group-btn"
                  onClick={() => setMapOffsetX((x) => x - 40)}
                  title="Dịch bản đồ sang trái"
                >
                  Phải →
                </button>
                <button
                  type="button"
                  className="ef-btn-group-btn"
                  onClick={() => setMapOffsetY((y) => y + 30)}
                  title="Dịch bản đồ xuống dưới"
                >
                  ↑ Lên
                </button>
                <button
                  type="button"
                  className="ef-btn-group-btn"
                  onClick={() => setMapOffsetY((y) => y - 30)}
                  title="Dịch bản đồ lên trên"
                >
                  Xuống ↓
                </button>
              </div>
            </div>

            {/* Player Chevron Indicator Toggle */}
            <div className="ef-setting-row">
              <span className="ef-setting-label">Mũi Tên Chỉ Hướng Tâm HUD:</span>
              <div className="ef-btn-group">
                <button
                  type="button"
                  className={`ef-btn-group-btn ${showChevron ? 'active' : ''}`}
                  onClick={() => setShowChevron(true)}
                >
                  Bật Con Trỏ
                </button>
                <button
                  type="button"
                  className={`ef-btn-group-btn ${!showChevron ? 'active' : ''}`}
                  onClick={() => setShowChevron(false)}
                  title="Ẩn nếu muốn dùng con trỏ riêng của SKPort khi bật Location Sync"
                >
                  Dùng Icon SKPort
                </button>
              </div>
            </div>

            {/* Opacity Slider */}
            <div className="ef-setting-row">
              <div className="ef-setting-label">
                <span>Độ trong suốt:</span>
                <span style={{ color: 'var(--ef-yellow-bright)' }}>{opacity}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--ef-yellow)' }}
              />
            </div>

            {/* Map Source */}
            <div className="ef-setting-row">
              <span className="ef-setting-label">Nguồn Bản Đồ:</span>
              <div className="ef-btn-group">
                {MAP_OPTIONS.slice(0, 2).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`ef-btn-group-btn ${selectedMapId === opt.id ? 'active' : ''}`}
                    onClick={() => setSelectedMapId(opt.id)}
                  >
                    {opt.shortName}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
