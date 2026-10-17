import React, { useState, useEffect } from 'react';
import {
  Compass,
  ExternalLink,
  Layers,
  MonitorPlay,
  RotateCw,
  Sparkles,
} from 'lucide-react';
import { listen } from '@tauri-apps/api/event';
import { toggleOverlay, isOverlayVisible, openOfficialLauncher } from '../services/nativeApi';
import { ENDFIELD_BIZ } from '../services/endfieldApi';
import endfieldLogo from '../assets/endfield-logo.svg';

interface EndfieldMapTabProps {
  currentPath?: string;
  onOpenFolder?: () => void;
}

const MAP_SOURCES = [
  {
    id: 'skport',
    name: 'SKPort (Chính thức)',
    url: 'https://game.skport.com/map/endfield',
    desc: 'Dữ liệu chính thức Gryphline, chuẩn xác tài nguyên & rương',
  },
  {
    id: 'endfieldgg',
    name: 'Endfield.GG',
    url: 'https://endfield.gg/map/',
    desc: 'Bản đồ cộng đồng toàn cầu, tiếng Anh & bộ lọc vị trí trực quan',
  },
];

export const EndfieldMapTab: React.FC<EndfieldMapTabProps> = ({ currentPath }) => {
  const [activeSourceId, setActiveSourceId] = useState<'skport' | 'endfieldgg'>('skport');
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [isOverlayStarting, setIsOverlayStarting] = useState(false);
  const [isOverlayActive, setIsOverlayActive] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    isOverlayVisible().then((visible) => {
      if (isMounted) setIsOverlayActive(visible);
    });

    const unlisten = listen<boolean>('overlay_visibility_changed', (event) => {
      if (isMounted) {
        setIsOverlayActive(event.payload);
      }
    });

    return () => {
      isMounted = false;
      unlisten.then((f) => f());
    };
  }, []);

  const currentSource = MAP_SOURCES.find((s) => s.id === activeSourceId) || MAP_SOURCES[0];

  const handleToggleOverlay = async () => {
    setIsOverlayStarting(true);
    try {
      await toggleOverlay(currentSource.url);
    } catch (e) {
      console.error('Failed to toggle overlay:', e);
    } finally {
      setTimeout(() => setIsOverlayStarting(false), 500);
    }
  };

  const handleOpenOfficialLauncher = async () => {
    if (currentPath) {
      await openOfficialLauncher(currentPath, ENDFIELD_BIZ);
    } else {
      await openOfficialLauncher('', ENDFIELD_BIZ);
    }
  };

  return (
    <div className="endfield-map-view">
      {/* Top Header Bar */}
      <header className="endfield-map-header">
        <div className="header-left">
          <img src={endfieldLogo} alt="Endfield" className="endfield-tab-logo" />
          <div className="header-title-box">
            <div className="header-title-row">
              <span className="header-tag">A9E LIVE RADAR</span>
              <h2 className="header-title">BẢN ĐỒ TƯƠNG TÁC & OVERLAY</h2>
            </div>
            <p className="header-sub">
              Hỗ trợ <b>Location Sync</b>: Đăng nhập & gạt bật ở góc dưới-phải để Radar tự bám theo nhân vật trong game
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="header-actions">
          {/* Source Switcher */}
          <div className="source-segmented-control">
            {MAP_SOURCES.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`source-pill ${activeSourceId === s.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveSourceId(s.id as any);
                  setIframeKey((k) => k + 1);
                }}
              >
                <Layers size={13} />
                <span>{s.name}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            className="action-btn secondary"
            onClick={() => setIframeKey((k) => k + 1)}
            title="Tải lại bản đồ"
          >
            <RotateCw size={14} />
          </button>

          <a
            href={currentSource.url}
            target="_blank"
            rel="noreferrer"
            className="action-btn secondary"
            title="Mở trên trình duyệt ngoài"
          >
            <ExternalLink size={14} />
          </a>

          {currentPath && (
            <button
              type="button"
              className="action-btn launcher-btn"
              onClick={handleOpenOfficialLauncher}
              title="Khởi động Gryphline Launcher để chạy game"
            >
              <MonitorPlay size={14} />
              <span>Mở Launcher Gốc</span>
            </button>
          )}

          {/* Main Primary Button: Toggle Overlay */}
          <button
            type="button"
            className={`action-btn primary-radar ${isOverlayStarting ? 'loading' : ''} ${isOverlayActive ? 'active' : ''}`}
            onClick={handleToggleOverlay}
            title={isOverlayActive ? "Tắt Radar Overlay và quay lại bản đồ Launcher" : "Bật cửa sổ radar trong game (Phím tắt: Alt + M)"}
          >
            <Compass size={16} className={isOverlayActive ? "radar-icon-spin" : ""} />
            <div className="btn-text-col">
              <span className="btn-main">
                {isOverlayActive ? 'TẮT RADAR OVERLAY' : 'BẬT RADAR OVERLAY'}
              </span>
              <span className="btn-sub">
                {isOverlayActive ? 'Quay lại Launcher' : 'Phím tắt: Alt + M'}
              </span>
            </div>
          </button>
        </div>
      </header>

      {/* Hotkeys & Quick Guide Ribbon */}
      <div className="endfield-hotkeys-ribbon">
        <div className="hotkey-item">
          <kbd>Alt + M</kbd>
          <span>Ẩn / Hiện Radar Minimap</span>
        </div>
        <div className="hotkey-sep" />
        <div className="hotkey-item">
          <kbd>Alt + S</kbd>
          <span>Mở Cài Đặt & Lọc Marker</span>
        </div>
        <div className="hotkey-sep" />
        <div className="hotkey-item">
          <kbd>Alt + F</kbd>
          <span>Chuyển Mini / Full Map</span>
        </div>
        <div className="hotkey-sep" />
        <div className="hotkey-tip">
          <Sparkles size={13} color="#f59e0b" />
          <span>HUD độc lập qua Tauri OS Window • Không can thiệp file game • An toàn 100%</span>
        </div>
      </div>

      {/* Main Interactive Map Viewport vs Active Overlay Placeholder */}
      <main className={`endfield-iframe-container ${isOverlayActive ? 'endfield-overlay-active-placeholder' : ''}`}>
        {isOverlayActive ? (
          <div className="overlay-active-card">
            <div className="overlay-active-radar-pulse">
              <Compass size={40} className="radar-icon-spin" />
            </div>
            <div className="overlay-active-badge">OVERLAY ĐANG HOẠT ĐỘNG</div>
            <h3 className="overlay-active-title">RADAR MINIMAP ĐÃ HIỂN THỊ TRÊN GAME</h3>
            <p className="overlay-active-desc">
              Bản đồ tương tác và kết nối <b>Location Sync</b> đã được chuyển sang cửa sổ Radar Overlay để bám theo nhân vật trong game.
              <br />
              (Đã tự động tạm dừng bản đồ tại Launcher để tránh xung đột kết nối hai phiên cùng lúc)
            </p>

            <div className="overlay-active-actions">
              <button
                type="button"
                className="action-btn primary-radar"
                onClick={handleToggleOverlay}
              >
                <RotateCw size={14} />
                <span>TẮT OVERLAY & QUAY LẠI BẢN ĐỒ LAUNCHER</span>
              </button>
            </div>

            <div className="overlay-active-shortcuts">
              <div className="shortcut-tag"><kbd>Alt + M</kbd> Ẩn/Hiện Overlay</div>
              <div className="shortcut-tag"><kbd>Alt + F</kbd> Phóng to / Thu nhỏ</div>
              <div className="shortcut-tag"><kbd>Alt + S</kbd> Cài đặt Radar</div>
              <div className="shortcut-tag"><kbd>Alt + G</kbd> Xuyên chuột (Ghost)</div>
            </div>
          </div>
        ) : (
          <iframe
            key={iframeKey}
            src={currentSource.url}
            title="Arknights Endfield Live Map"
            className="endfield-map-iframe"
            allow="geolocation; fullscreen"
            loading="lazy"
          />
        )}
      </main>
    </div>
  );
};
