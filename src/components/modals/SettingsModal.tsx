import React, { useState } from 'react';
import { X, FolderOpen } from 'lucide-react';
import { HoyoGame, Region } from '../../types';
import { pickGameFile } from '../../services/nativeApi';

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
  const [pathInput, setPathInput] = useState<string>(currentPath);
  const [selectedRegion, setSelectedRegion] = useState<Region>(region);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(language);

  const handlePickFile = async () => {
    try {
      const selected = await pickGameFile();
      if (selected) setPathInput(selected);
    } catch (err) {
      console.error('Lỗi chọn file:', err);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span>Cài Đặt Void0 Launcher</span>
          <button className="win-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>
              Đường dẫn tệp thực thi của <strong>{currentGame?.display?.name}</strong> (.exe):
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                className="form-input"
                style={{ flex: 1 }}
                placeholder="Ví dụ: D:\Games\ZenlessZoneZero Game\ZenlessZoneZero.exe"
                value={pathInput}
                onChange={(e) => setPathInput(e.target.value)}
              />
              <button
                className="btn-secondary"
                type="button"
                onClick={handlePickFile}
                title="Duyệt tìm tệp .exe trên máy tính"
              >
                <FolderOpen size={16} />
                <span>Duyệt File</span>
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Khu vực máy chủ (Server Region):</label>
            <select
              className="form-input"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value as Region)}
            >
              <option value="os">Global - HoYoverse (sg-hyp-api.hoyoverse.com)</option>
              <option value="cn">China - miHoYo (hyp-api.mihoyo.com)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Ngôn ngữ hiển thị nội dung HoYo:</label>
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

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
            <button className="btn-secondary" onClick={onClose}>
              Hủy
            </button>
            <button
              className="btn-primary-play"
              style={{ padding: '8px 24px', fontSize: 14 }}
              onClick={() => onSave(pathInput, selectedRegion, selectedLanguage)}
            >
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
