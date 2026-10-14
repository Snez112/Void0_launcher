import React, { useState } from 'react';
import { X, ExternalLink, Sparkles, Download, Layers } from 'lucide-react';
import { HoyoGamePackageResult } from '../../types';
import { getT } from '../../i18n/translations';

interface PackageModalProps {
  packageData: HoyoGamePackageResult;
  language: string;
  onClose: () => void;
}

export const PackageModal: React.FC<PackageModalProps> = ({ packageData, language, onClose }) => {
  const t = getT(language);
  const hasPre = Boolean(
    packageData.pre_download?.major ||
    (packageData.pre_download?.patches && packageData.pre_download.patches.length > 0)
  );
  const [selectedTab, setSelectedTab] = useState<'main' | 'pre' | 'patch'>(hasPre ? 'pre' : 'main');

  const currentPkg = selectedTab === 'pre'
    ? packageData.pre_download?.major || packageData.pre_download?.patches?.[0]
    : packageData.main;

  const patches = selectedTab === 'pre'
    ? packageData.pre_download?.patches || []
    : packageData.patches || [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ width: '680px', maxWidth: '95vw' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Download size={18} color="var(--accent-yellow)" />
            <span>
              {hasPre ? t.pkgModalPreTitle : t.pkgModalTitle}
            </span>
          </div>
          <button className="win-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Tab selection */}
        <div className="gacha-nav-tabs" style={{ padding: '8px 16px' }}>
          {hasPre && (
            <button
              className={`gacha-tab-btn ${selectedTab === 'pre' ? 'active' : ''}`}
              onClick={() => setSelectedTab('pre')}
              style={{ color: selectedTab === 'pre' ? '#111' : '#38bdf8' }}
            >
              <Sparkles size={14} />
              <span>
                {t.preDownloadTab.replace(
                  '{version}',
                  packageData.pre_download?.major?.version || packageData.pre_download?.patches?.[0]?.version || ''
                )}
              </span>
            </button>
          )}

          <button
            className={`gacha-tab-btn ${selectedTab === 'main' ? 'active' : ''}`}
            onClick={() => setSelectedTab('main')}
          >
            <Download size={14} />
            <span>{t.fullGameTab.replace('{version}', packageData.main?.version || '')}</span>
          </button>

          {patches.length > 0 && (
            <button
              className={`gacha-tab-btn ${selectedTab === 'patch' ? 'active' : ''}`}
              onClick={() => setSelectedTab('patch')}
            >
              <Layers size={14} />
              <span>{t.olderPatchesTab.replace('{count}', String(patches.length))}</span>
            </button>
          )}
        </div>

        <div className="modal-body">
          {selectedTab === 'patch' ? (
            <div className="pkg-list">
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>
                {t.patchesNotice}
              </div>
              {patches.map((p, pIdx) => (
                <div key={pIdx} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent-yellow)', marginBottom: 4 }}>
                    {t.patchToVersion.replace('{version}', p.version)}
                  </div>
                  {p.game_pkgs.map((pkg, idx) => (
                    <div key={idx} className="pkg-item">
                      <span>
                        {t.gamePart
                          .replace('{index}', String(idx + 1))
                          .replace('{size}', (Number(pkg.size) / (1024 * 1024 * 1024)).toFixed(2))}
                      </span>
                      <a href={pkg.url} target="_blank" rel="noreferrer">
                        {t.downloadPatchBtn} <ExternalLink size={12} style={{ verticalAlign: 'middle' }} />
                      </a>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : currentPkg ? (
            <div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 10 }}>
                {selectedTab === 'pre' ? (
                  <span style={{ color: '#38bdf8' }}>
                    {t.preDownloadNotice}
                  </span>
                ) : (
                  <span>{t.directCdnNotice.replace('{version}', currentPkg.version)}</span>
                )}
              </div>

              <div className="pkg-list">
                {currentPkg.game_pkgs.map((pkg, idx) => (
                  <div key={idx} className="pkg-item">
                    <span>
                      {t.gamePart
                        .replace('{index}', String(idx + 1))
                        .replace('{size}', (Number(pkg.size) / (1024 * 1024 * 1024)).toFixed(2))}
                    </span>
                    <a href={pkg.url} target="_blank" rel="noreferrer">
                      {t.downloadFileBtn} <ExternalLink size={12} style={{ verticalAlign: 'middle' }} />
                    </a>
                  </div>
                ))}

                {currentPkg.audio_pkgs.map((audio, idx) => (
                  <div key={`audio-${idx}`} className="pkg-item">
                    <span>
                      {t.audioPart
                        .replace('{lang}', audio.language)
                        .replace('{size}', (Number(audio.size) / (1024 * 1024 * 1024)).toFixed(2))}
                    </span>
                    <a href={audio.url} target="_blank" rel="noreferrer">
                      {t.downloadAudioBtn} <ExternalLink size={12} style={{ verticalAlign: 'middle' }} />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ padding: '30px 0', textAlign: 'center', color: 'var(--text-dim)' }}>
              {t.noPreDownloadNotice}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
