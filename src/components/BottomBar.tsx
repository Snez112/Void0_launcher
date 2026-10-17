import React from 'react';
import { Play, FolderOpen, DownloadCloud, Sliders } from 'lucide-react';
import { HoyoGamePackageResult } from '../types';
import { getT } from '../i18n/translations';

function isOlderVersion(localVer: string, remoteVer: string): boolean {
  const lParts = localVer.split('.').map((p) => parseInt(p, 10) || 0);
  const rParts = remoteVer.split('.').map((p) => parseInt(p, 10) || 0);
  const maxLen = Math.max(lParts.length, rParts.length);

  for (let i = 0; i < maxLen; i++) {
    const l = lParts[i] || 0;
    const r = rParts[i] || 0;
    if (l < r) return true;
    if (l > r) return false;
  }
  return false;
}

interface BottomBarProps {
  packageData: HoyoGamePackageResult | null;
  currentPath: string;
  language: string;
  localVersion?: string | null;
  isRunning?: boolean;
  onOpenSettings: () => void;
  onOpenGameSettings: () => void;
  onOpenPackageModal: () => void;
  onOpenFolder: () => void;
  onLaunchGame: () => void;
}

export const BottomBar: React.FC<BottomBarProps> = ({
  packageData,
  currentPath,
  language,
  localVersion,
  isRunning,
  onOpenSettings,
  onOpenGameSettings,
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

  const hasUpdate = Boolean(
    currentPath &&
    localVersion &&
    mainPkg?.version &&
    isOlderVersion(localVersion, mainPkg.version)
  );

  const playButtonLabel = !currentPath
    ? t.settingsBtn
    : isRunning
    ? t.gameRunningBtn
    : hasUpdate
    ? t.updateGameBtn
    : t.launchGameBtn;

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
        {/* Pre-download button: chỉ hiện khi game có pre-installer cho phiên bản mới */}
        {hasPreDownload && (
          <button
            className="btn-secondary"
            onClick={onOpenPackageModal}
            title={t.preDownloadTip}
            style={{
              borderColor: 'rgba(56, 189, 248, 0.45)',
              color: '#38bdf8',
              background: 'rgba(14, 165, 233, 0.12)',
            }}
          >
            <DownloadCloud size={16} />
            <span>{t.preDownloadBtn}</span>
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

        {/* Game Graphics & Launch Settings */}
        <button
          className="btn-secondary"
          onClick={onOpenGameSettings}
          title={t.gameSettingsTitle.replace(' ({game})', '')}
          style={{ padding: '8px 12px' }}
        >
          <Sliders size={18} />
        </button>

        <button
          className="btn-primary-play"
          onClick={isRunning ? undefined : onLaunchGame}
          disabled={isRunning}
          style={
            isRunning
              ? {
                  background: 'rgba(255, 255, 255, 0.12)',
                  color: 'rgba(255, 255, 255, 0.45)',
                  cursor: 'not-allowed',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: 'none',
                }
              : hasUpdate
              ? { background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)', color: '#fff' }
              : undefined
          }
        >
          {isRunning ? (
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: '#22c55e',
                boxShadow: '0 0 8px #22c55e',
                display: 'inline-block',
                marginRight: 4,
              }}
            />
          ) : hasUpdate ? (
            <DownloadCloud size={20} />
          ) : (
            <Play size={20} fill="#111" />
          )}
          <span>{playButtonLabel}</span>
        </button>
      </div>
    </div>
  );
};
