import React from 'react';
import { Play, FolderOpen, DownloadCloud, Sparkles } from 'lucide-react';
import { HoyoGamePackageResult } from '../types';

interface BottomBarProps {
  packageData: HoyoGamePackageResult | null;
  currentPath: string;
  onOpenSettings: () => void;
  onOpenPackageModal: () => void;
  onOpenFolder: () => void;
  onLaunchGame: () => void;
}

export const BottomBar: React.FC<BottomBarProps> = ({
  packageData,
  currentPath,
  onOpenSettings,
  onOpenPackageModal,
  onOpenFolder,
  onLaunchGame,
}) => {
  const mainPkg = packageData?.main;
  const hasPreDownload = Boolean(
    packageData?.pre_download?.major ||
    (packageData?.pre_download?.patches && packageData.pre_download.patches.length > 0)
  );

  return (
    <div className="bottom-bar">
      <div className="bottom-info">
        {mainPkg?.version && (
          <div className="version-pill">
            <span>Phiên bản: {mainPkg.version}</span>
          </div>
        )}
        <div
          className="path-selector"
          onClick={onOpenSettings}
          title="Nhấn để cấu hình file chạy"
        >
          <FolderOpen size={16} />
          <span>{currentPath ? currentPath : 'Chưa chọn đường dẫn game (.exe)'}</span>
        </div>
      </div>

      <div className="bottom-actions">
        {/* Pre-download button highlight if HoYoverse opens pre-download */}
        {hasPreDownload && (
          <button
            className="btn-primary-play"
            style={{
              background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)',
              color: '#fff',
              boxShadow: '0 4px 15px rgba(14, 165, 233, 0.4)',
              padding: '10px 16px',
            }}
            onClick={onOpenPackageModal}
            title="Tải trước bản cập nhật mới ngay từ bây giờ!"
          >
            <Sparkles size={16} />
            <span>TẢI TRƯỚC</span>
          </button>
        )}

        {packageData && (
          <button
            className="btn-secondary"
            onClick={onOpenPackageModal}
            title="Xem chi tiết gói cài đặt / bản vá"
          >
            <DownloadCloud size={16} />
            <span>
              {hasPreDownload ? 'Các Gói Tải' : `Gói Tải (${mainPkg?.game_pkgs?.length || 0} phần)`}
            </span>
          </button>
        )}

        {currentPath && (
          <button
            className="btn-secondary"
            onClick={onOpenFolder}
            title="Mở thư mục cài đặt"
          >
            <FolderOpen size={16} />
            <span>Thư Mục</span>
          </button>
        )}

        <button className="btn-primary-play" onClick={onLaunchGame}>
          <Play size={20} fill="#111" />
          <span>{currentPath ? 'BẮT ĐẦU' : 'CHỌN GAME'}</span>
        </button>
      </div>
    </div>
  );
};
