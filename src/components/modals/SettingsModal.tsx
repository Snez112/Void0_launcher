import React, { useState } from 'react';
import { X, FolderOpen, FileText } from 'lucide-react';
import { HoyoGame, Region } from '../../types';
import { pickGameFile, pickGameFolder } from '../../services/nativeApi';
import { getT } from '../../i18n/translations';
import { CustomSelect } from '../common/CustomSelect';

interface SettingsModalProps {
  currentGame?: HoyoGame;
  currentPath: string;
  region: Region;
  language: string;
  onClose: () => void;
  onSave: (path: string, region: Region, language: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  currentGame,
  currentPath,
  region,
  language,
  onClose,
  onSave,
}) => {
  const t = getT(language);
  const [pathInput, setPathInput] = useState<string>(currentPath);
  const [selectedRegion, setSelectedRegion] = useState<Region>(region);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(language);

  const handlePickFolder = async () => {
    try {
      const selected = await pickGameFolder();
      if (selected) setPathInput(selected);
    } catch (err) {
      console.error('Lỗi chọn thư mục:', err);
    }
  };

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
    ? 'F:\\GRYPHLINK\\games\\EndField Game'
    : currentGame?.display?.name
    ? `D:\\Games\\${currentGame.display.name}`
    : 'D:\\Games\\ZenlessZoneZero Game';

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
                onClick={handlePickFolder}
                title={t.browseFolderBtn}
                style={{ background: 'rgba(245, 158, 11, 0.15)', borderColor: 'rgba(245, 158, 11, 0.4)' }}
              >
                <FolderOpen size={16} />
                <span>{t.browseFolderBtn}</span>
              </button>
              <button
                className="btn-secondary"
                type="button"
                onClick={handlePickFile}
                title={t.browseFileBtn}
              >
                <FileText size={16} />
                <span>{t.browseFileBtn}</span>
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>{t.serverRegionLabel}:</label>
            <CustomSelect
              value={selectedRegion}
              options={
                isEndfield
                  ? [
                      { value: 'os', label: 'Global - GRYPHLINE (launcher.gryphline.com)' },
                      { value: 'cn', label: 'China - Hypergryph (launcher.hypergryph.com)' },
                    ]
                  : [
                      { value: 'os', label: 'Global - HoYoverse (sg-hyp-api.hoyoverse.com)' },
                      { value: 'cn', label: 'China - miHoYo (hyp-api.mihoyo.com)' },
                    ]
              }
              onChange={(val) => setSelectedRegion(val as Region)}
            />
          </div>

          <div className="form-group">
            <label>{t.contentLangLabel}:</label>
            <CustomSelect
              value={selectedLanguage}
              options={[
                { value: 'vi-vn', label: 'Tiếng Việt (vi-vn)' },
                { value: 'en-us', label: 'English (en-us)' },
                { value: 'zh-cn', label: '简体中文 (zh-cn)' },
              ]}
              onChange={(val) => setSelectedLanguage(val as string)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
            <button className="btn-secondary" onClick={onClose}>
              {t.cancelBtn}
            </button>
            <button
              className="btn-primary-play"
              style={{ padding: '8px 24px', fontSize: 14 }}
              onClick={() => onSave(pathInput, selectedRegion, selectedLanguage)}
            >
              {t.saveBtn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
