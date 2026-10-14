import React from 'react';
import { Play, FolderOpen, DownloadCloud, Sparkles } from 'lucide-react';
import { HoyoGamePackageResult } from '../types';
import { getT } from '../i18n/translations';

interface BottomBarProps {
  packageData: HoyoGamePackageResult | null;
  currentPath: string;
  language: string;
  onOpenSettings: () => void;
  onOpenPackageModal: () => void;
  onOpenFolder: () => void;
  onLaunchGame: () => void;
}

export const BottomBar: React.FC<BottomBarProps> = ({
  packageData,
  currentPath,
  language,
  onOpenSettings,
  onOpenPackageModal,
  onOpenFolder,
  onLaunchGame,
}) => {
  const t = getT(language);
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
            <span>{t.versionPill}: {mainPkg.version}</span>
          </div>
        )}
        <div
          className="path-selector"
          onClick={onOpenSettings}
          title={t.configPathTip}
        >
          <FolderOpen size={16} />
          <span>{currentPath ? currentPath : t.noPathSelected}</span>
        </div>
      </div>

      <div className="bottom-actions">
        {/* Pre-download button highlight */}
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
            title={t.preDownloadTip}
          >
            <Sparkles size={16} />
            <span>{t.preDownloadBtn}</span>
          </button>
        )}

        {packageData && (
          <button
            className="btn-secondary"
            onClick={onOpenPackageModal}
            title={t.packagesBtn}
          >
            <DownloadCloud size={16} />
            <span>
              {hasPreDownload
                ? t.packagesBtn
                : t.packagesPartsBtn.replace('{count}', String(mainPkg?.game_pkgs?.length || 0))}
            </span>
          </button>
        )}

        {currentPath && (
          <button
            className="btn-secondary"
            onClick={onOpenFolder}
            title={t.openFolderBtn}
          >
            <FolderOpen size={16} />
            <span>{t.openFolderBtn}</span>
          </button>
        )}

        <button className="btn-primary-play" onClick={onLaunchGame}>
          <Play size={20} fill="#111" />
          <span>{currentPath ? t.launchGameBtn : t.settingsBtn}</span>
        </button>
      </div>
    </div>
  );
};
