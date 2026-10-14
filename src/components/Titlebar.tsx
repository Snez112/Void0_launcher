import React, { useState, useRef, useEffect } from 'react';
import {
  Settings,
  Minus,
  Square,
  X,
  Volume2,
  VolumeX,
  Globe,
  Languages,
  ChevronDown,
  Check,
} from 'lucide-react';
import { Region, AppConfig } from '../types';
import {
  windowStartDragging,
  windowMinimize,
  windowToggleMaximize,
  windowClose,
} from '../services/nativeApi';

interface TitlebarProps {
  config: AppConfig;
  onChangeConfig: (newConfig: AppConfig) => void;
  onOpenSettings: () => void;
}

const REGION_OPTIONS: Array<{ value: Region; label: string }> = [
  { value: 'os', label: 'Global (HoYoverse)' },
  { value: 'cn', label: 'China (miHoYo)' },
];

const LANG_OPTIONS = [
  { value: 'vi-vn', label: 'Tiếng Việt' },
  { value: 'en-us', label: 'English' },
  { value: 'zh-cn', label: '简体中文' },
];

export const Titlebar: React.FC<TitlebarProps> = ({
  config,
  onChangeConfig,
  onOpenSettings,
}) => {
  const [openRegionMenu, setOpenRegionMenu] = useState(false);
  const [openLangMenu, setOpenLangMenu] = useState(false);

  const regionRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (regionRef.current && !regionRef.current.contains(e.target as Node)) {
        setOpenRegionMenu(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setOpenLangMenu(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && !(e.target as HTMLElement).closest('button, select, input, a')) {
      windowStartDragging();
    }
  };

  const currentRegionLabel =
    REGION_OPTIONS.find((r) => r.value === config.region)?.label || 'Server';

  const currentLangLabel =
    LANG_OPTIONS.find((l) => l.value === config.language)?.label || 'Ngôn ngữ';

  return (
    <header className="titlebar" data-tauri-drag-region onMouseDown={handleMouseDown}>
      <div className="titlebar-brand" data-tauri-drag-region>
        <span>Void0 Launcher</span>
        <span className="brand-badge">HoyoPlay</span>
      </div>

      <div className="titlebar-center">
        {/* Custom Server Region Dropdown */}
        <div className="custom-dropdown-container" ref={regionRef}>
          <button
            type="button"
            className={`custom-dropdown-trigger ${openRegionMenu ? 'open' : ''}`}
            onClick={() => {
              setOpenRegionMenu(!openRegionMenu);
              setOpenLangMenu(false);
            }}
          >
            <Globe size={13} color="var(--accent-yellow)" />
            <span>{currentRegionLabel}</span>
            <ChevronDown size={13} className="chevron" />
          </button>

          {openRegionMenu && (
            <div className="custom-dropdown-menu">
              {REGION_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`custom-dropdown-item ${config.region === opt.value ? 'active' : ''}`}
                  onClick={() => {
                    onChangeConfig({ ...config, region: opt.value });
                    setOpenRegionMenu(false);
                  }}
                >
                  <span>{opt.label}</span>
                  {config.region === opt.value && <Check size={13} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Custom Language Dropdown */}
        <div className="custom-dropdown-container" ref={langRef}>
          <button
            type="button"
            className={`custom-dropdown-trigger ${openLangMenu ? 'open' : ''}`}
            onClick={() => {
              setOpenLangMenu(!openLangMenu);
              setOpenRegionMenu(false);
            }}
          >
            <Languages size={13} color="#38bdf8" />
            <span>{currentLangLabel}</span>
            <ChevronDown size={13} className="chevron" />
          </button>

          {openLangMenu && (
            <div className="custom-dropdown-menu">
              {LANG_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`custom-dropdown-item ${config.language === opt.value ? 'active' : ''}`}
                  onClick={() => {
                    onChangeConfig({ ...config, language: opt.value });
                    setOpenLangMenu(false);
                  }}
                >
                  <span>{opt.label}</span>
                  {config.language === opt.value && <Check size={13} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sound toggle */}
        <button
          className="win-btn"
          title={config.soundEnabled ? 'Tắt âm thanh video nền' : 'Bật âm thanh video nền'}
          onClick={() => onChangeConfig({ ...config, soundEnabled: !config.soundEnabled })}
        >
          {config.soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
      </div>

      <div className="titlebar-controls">
        <button className="win-btn" onClick={onOpenSettings} title="Cài đặt">
          <Settings size={15} />
        </button>
        <button className="win-btn" onClick={windowMinimize} title="Thu nhỏ">
          <Minus size={15} />
        </button>
        <button className="win-btn" onClick={windowToggleMaximize} title="Phóng to">
          <Square size={13} />
        </button>
        <button className="win-btn close" onClick={windowClose} title="Đóng">
          <X size={16} />
        </button>
      </div>
    </header>
  );
};
