import React, { useState } from 'react';
import { X, FolderOpen } from 'lucide-react';
import { HoyoGame, Region } from '../../types';
import { pickGameFile } from '../../services/nativeApi';
import { getT } from '../../i18n/translations';

interface SettingsModalProps {
  currentGame?: HoyoGame;
  currentPath: string;
  region: Region;
  language: string;
  discordClientId?: string;
  onClose: () => void;
  onSave: (path: string, region: Region, language: string, discordClientId?: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  currentGame,
  currentPath,
  region,
  language,
  discordClientId,
  onClose,
  onSave,
}) => {
  const t = getT(language);
  const [pathInput, setPathInput] = useState<string>(currentPath);
  const [selectedRegion, setSelectedRegion] = useState<Region>(region);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(language);
  const [clientIdInput, setClientIdInput] = useState<string>(discordClientId || '');

  const handlePickFile = async () => {
    try {
      const selected = await pickGameFile();
      if (selected) setPathInput(selected);
    } catch (err) {
      console.error('Lỗi chọn file:', err);
    }
  };

  const isEndfield =
    currentGame?.id.includes('endfield') || currentGame?.biz.includes('endfield');

  const defaultPlaceholder = isEndfield
    ? 'D:\\Games\\Endfield\\Beyond.exe'
    : currentGame?.display?.name
    ? `D:\\Games\\${currentGame.display.name}\\${currentGame.display.name.replace(/[^a-zA-Z0-9]/g, '')}.exe`
    : 'D:\\Games\\ZenlessZoneZero Game\\ZenlessZoneZero.exe';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span>{t.settingsTitle}</span>
          <button className="win-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>
              {t.exePathLabel.replace('{game}', currentGame?.display?.name || '')}:
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                className="form-input"
                style={{ flex: 1 }}
                placeholder={defaultPlaceholder}
                value={pathInput}
                onChange={(e) => setPathInput(e.target.value)}
              />
              <button
                className="btn-secondary"
                type="button"
                onClick={handlePickFile}
                title={t.browseFileBtn}
              >
                <FolderOpen size={16} />
                <span>{t.browseFileBtn}</span>
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>{t.serverRegionLabel}:</label>
            <select
              className="form-input"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value as Region)}
            >
              {isEndfield ? (
                <>
                  <option value="os">Global - GRYPHLINE (launcher.gryphline.com)</option>
                  <option value="cn">China - Hypergryph (launcher.hypergryph.com)</option>
                </>
              ) : (
                <>
                  <option value="os">Global - HoYoverse (sg-hyp-api.hoyoverse.com)</option>
                  <option value="cn">China - miHoYo (hyp-api.mihoyo.com)</option>
                </>
              )}
            </select>
          </div>

          <div className="form-group">
            <label>{t.contentLangLabel}:</label>
            <select
              className="form-input"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              <option value="vi-vn">Tiếng Việt (vi-vn)</option>
              <option value="en-us">English (en-us)</option>
              <option value="zh-cn">简体中文 (zh-cn)</option>
            </select>
          </div>

          <div className="form-group">
            <label>{t.discordClientIdLabel}:</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ví dụ: 1124154024879456276 (hoặc App ID riêng)"
              value={clientIdInput}
              onChange={(e) => setClientIdInput(e.target.value)}
            />
            <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 4 }}>
              {t.discordClientIdTip}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
            <button className="btn-secondary" onClick={onClose}>
              {t.cancelBtn}
            </button>
            <button
              className="btn-primary-play"
              style={{ padding: '8px 24px', fontSize: 14 }}
              onClick={() => onSave(pathInput, selectedRegion, selectedLanguage, clientIdInput.trim())}
            >
              {t.saveBtn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
