import React, { useState, useEffect } from 'react';
import {
  X,
  RotateCw,
  Sparkles,
  Database,
  History,
  AlertCircle,
  HelpCircle,
  Folder,
} from 'lucide-react';
import { HoyoGame } from '../../types';
import { getT } from '../../i18n/translations';
import {
  GachaOverview,
  getGachaOverview,
  detectGachaCacheUrl,
  importGachaRecords,
} from '../../services/gachaApi';
import { openFolder } from '../../services/nativeApi';

interface RollTrackerModalProps {
  currentGame?: HoyoGame;
  gameExePath: string;
  language: string;
  onClose: () => void;
}

export const RollTrackerModal: React.FC<RollTrackerModalProps> = ({
  currentGame,
  gameExePath,
  language,
  onClose,
}) => {
  const t = getT(language);
  const [activeTab, setActiveTab] = useState<'stats' | 'history' | 'import'>('stats');
  const [overview, setOverview] = useState<GachaOverview | null>(null);
  const [selectedUid, setSelectedUid] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<string>('');
  const [customUrl, setCustomUrl] = useState<string>('');
  const [selectedBannerType, setSelectedBannerType] = useState<number | 'ALL'>('ALL');

  const biz = currentGame?.biz || '';

  const loadData = async (uid?: number | null) => {
    if (!biz) return;
    setLoading(true);
    try {
      const data = await getGachaOverview(biz, uid);
      setOverview(data);
      if (data.selected_uid) {
        setSelectedUid(data.selected_uid);
      }
    } catch (err) {
      console.error('Lỗi tải dữ liệu gacha:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [biz]);

  const handleSyncFromCache = async () => {
    if (!biz) return;
    setSyncing(true);
    setSyncStatus(t.scanningCache);
    try {
      const url = await detectGachaCacheUrl(biz, gameExePath);
      setSyncStatus(t.foundGachaUrl);
      const count = await importGachaRecords(url, biz);
      setSyncStatus(t.syncComplete.replace('{count}', String(count)));
      await loadData(selectedUid);
    } catch (err) {
      setSyncStatus(`${t.syncFailed}: ${err}`);
    } finally {
      setSyncing(false);
    }
  };

  const handleSyncManual = async () => {
    if (!customUrl.trim() || !biz) return;
    setSyncing(true);
    setSyncStatus(t.syncingManual);
    try {
      const count = await importGachaRecords(customUrl.trim(), biz);
      setSyncStatus(t.syncComplete.replace('{count}', String(count)));
      setCustomUrl('');
      await loadData(selectedUid);
    } catch (err) {
      setSyncStatus(`${t.syncFailed}: ${err}`);
    } finally {
      setSyncing(false);
    }
  };

  const isZzz = biz.includes('nap') || biz.includes('zzz');

  const filteredHistory = overview?.recent_records.filter((rec) => {
    if (selectedBannerType === 'ALL') return true;
    if (selectedBannerType === 301 && (rec.gacha_type === 301 || rec.gacha_type === 400)) return true;
    return rec.gacha_type === selectedBannerType;
  }) || [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ width: '1180px', maxWidth: '96vw', height: '92vh', display: 'flex', flexDirection: 'column' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Sparkles size={18} color="var(--accent-yellow)" />
            <span>
              {t.rollTrackerModalTitle} - {currentGame?.display?.name}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {overview?.uids && overview.uids.length > 0 && (
              <select
                className="custom-dropdown-trigger"
                style={{ height: 28, padding: '2px 8px', maxWidth: '240px' }}
                value={selectedUid || ''}
                onChange={(e) => {
                  const uid = Number(e.target.value);
                  setSelectedUid(uid);
                  loadData(uid);
                }}
              >
                {overview.uids.map((u) => (
                  <option key={u.uid} value={u.uid} style={{ background: '#1c212b', color: '#fff' }}>
                    {u.nickname ? `${u.nickname} (${u.uid})` : `UID: ${u.uid}`}
                  </option>
                ))}
              </select>
            )}
            <button className="win-btn" onClick={onClose}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="gacha-nav-tabs">
          <button
            className={`gacha-tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            <Sparkles size={14} />
            <span>{t.tabStats}</span>
          </button>
          <button
            className={`gacha-tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <History size={14} />
            <span>{t.tabHistory}</span>
          </button>
          <button
            className={`gacha-tab-btn ${activeTab === 'import' ? 'active' : ''}`}
            onClick={() => setActiveTab('import')}
          >
            <RotateCw size={14} />
            <span>{t.tabSync}</span>
          </button>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-dim)' }}>
            <Database size={13} color="var(--accent-yellow)" />
            <span>{overview?.db_path ? overview.db_path : 'Database'}</span>
            <button
              className="win-btn"
              style={{ width: 22, height: 22 }}
              title="Open database folder"
              onClick={() => {
                if (overview?.db_path) {
                  const dir = overview.db_path.substring(0, overview.db_path.lastIndexOf('\\'));
                  openFolder(dir);
                }
              }}
            >
              <Folder size={12} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {/* TAB 1: STATS & BANNERS */}
          {activeTab === 'stats' && (
            <div className="gacha-stats-view">
              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                  {t.loadingData}
                </div>
              ) : overview?.banners && overview.banners.length > 0 ? (
                <div className="banner-cards-grid">
                  {overview.banners.map((b) => (
                    <div key={b.gacha_type} className="banner-stat-card">
                      <div className="banner-stat-header">
                        <span className="banner-title">{b.gacha_name}</span>
                        <span className="banner-total">{b.total_pulls} {t.pullsUnit}</span>
                      </div>

                      <div className="pity-hero">
                        <div className="pity-number-group">
                          <span className="pity-label">{t.currentPityLabel}:</span>
                          <span className="pity-count">{b.current_pity}</span>
                          <span className="pity-max">/ 90</span>
                        </div>
                        <div className="pity-progress-bar">
                          <div
                            className="pity-fill"
                            style={{ width: `${Math.min((b.current_pity / 90) * 100, 100)}%` }}
                          />
                        </div>
                      </div>

                      <div className="pull-breakdown">
                        <div className="breakdown-tag five-star">
                          {isZzz ? 'S-Rank' : '5★'}: <strong>{b.five_star_count}</strong> ({(b.ratio_5 * 100).toFixed(1)}%)
                        </div>
                        <div className="breakdown-tag four-star">
                          {isZzz ? 'A-Rank' : '4★'}: <strong>{b.four_star_count}</strong> ({(b.ratio_4 * 100).toFixed(1)}%)
                        </div>
                        {b.five_star_count > 0 && (
                          <div className="breakdown-tag" style={{ background: 'rgba(255, 255, 255, 0.08)', color: 'var(--text-muted)' }}>
                            {t.averageLabel}: <strong>{b.average_5.toFixed(1)}</strong> {t.pullsUnit}
                          </div>
                        )}
                      </div>

                      {/* 5-Star History List */}
                      <div className="five-star-history">
                        <div className="five-star-history-title">{t.historyFiveStars}:</div>
                        {b.five_stars.length > 0 ? (
                          <div className="five-star-chips">
                            {b.five_stars.map((item, idx) => (
                              <div key={idx} className="five-star-chip">
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                  {item.icon ? (
                                    <img
                                      src={item.icon}
                                      alt={item.name}
                                      className="item-mini-icon"
                                    />
                                  ) : (
                                    <span className="item-mini-placeholder">★</span>
                                  )}
                                  <span className="item-name">{item.name}</span>
                                </div>
                                <span className="item-pity">[{item.pity} {t.pullsUnit}]</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="no-items">{t.noFiveStars}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-gacha-state">
                  <AlertCircle size={36} color="var(--accent-yellow)" />
                  <h4>{t.noGachaData}</h4>
                  <p>{t.noGachaHint}</p>
                  <button
                    className="btn-primary-play"
                    style={{ padding: '8px 24px', fontSize: 13, marginTop: 10 }}
                    onClick={() => setActiveTab('import')}
                  >
                    {t.goToSyncTab}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DETAILED HISTORY */}
          {activeTab === 'history' && (
            <div className="gacha-history-view">
              <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                <button
                  className={`news-tab-btn ${selectedBannerType === 'ALL' ? 'active' : ''}`}
                  onClick={() => setSelectedBannerType('ALL')}
                >
                  {t.allBanners}
                </button>
                {overview?.banners.map((b) => (
                  <button
                    key={b.gacha_type}
                    className={`news-tab-btn ${selectedBannerType === b.gacha_type ? 'active' : ''}`}
                    onClick={() => setSelectedBannerType(b.gacha_type)}
                  >
                    {b.gacha_name}
                  </button>
                ))}
              </div>

              <div className="history-table-container">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th style={{ width: '170px' }}>{t.thTime}</th>
                      <th>{t.thItemName}</th>
                      <th style={{ width: '110px' }}>{t.thType}</th>
                      <th style={{ width: '80px', textAlign: 'center' }}>{t.thRarity}</th>
                      <th style={{ width: '90px', textAlign: 'center' }}>{t.thPityPos}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHistory.map((item) => {
                      const isFive = isZzz ? item.rank_type === 4 : item.rank_type === 5;
                      const isFour = isZzz ? item.rank_type === 3 : item.rank_type === 4;
                      const rankLabel = isZzz
                        ? item.rank_type === 4
                          ? 'S-Rank'
                          : item.rank_type === 3
                          ? 'A-Rank'
                          : 'B-Rank'
                        : `${item.rank_type} ★`;

                      return (
                        <tr
                          key={item.id}
                          className={isFive ? 'row-five-star' : isFour ? 'row-four-star' : ''}
                        >
                          <td style={{ color: 'var(--text-dim)', fontSize: 12 }}>{item.time}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              {item.icon ? (
                                <img
                                  src={item.icon}
                                  alt={item.name}
                                  className={`table-item-icon ${
                                    isFive ? 'border-5' : isFour ? 'border-4' : 'border-3'
                                  }`}
                                />
                              ) : (
                                <div
                                  className={`table-item-icon placeholder ${
                                    isFive ? 'border-5' : isFour ? 'border-4' : 'border-3'
                                  }`}
                                >
                                  {item.name.slice(0, 1)}
                                </div>
                              )}
                              <span style={{ fontWeight: isFive || isFour ? 600 : 400 }}>
                                {item.name}
                              </span>
                            </div>
                          </td>
                          <td style={{ color: 'var(--text-muted)' }}>{item.item_type}</td>
                          <td style={{ textAlign: 'center' }}>
                            <span
                              className={`rank-badge ${
                                isFive ? 'rank-5' : isFour ? 'rank-4' : 'rank-3'
                              }`}
                            >
                              {rankLabel}
                            </span>
                          </td>
                          <td style={{ textAlign: 'center', fontWeight: 600 }}>{item.pity}</td>
                        </tr>
                      );
                    })}
                    {filteredHistory.length === 0 && (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-dim)' }}>
                          {t.noHistoryRows}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: SYNC DATA */}
          {activeTab === 'import' && (
            <div className="gacha-import-view">
              <div className="sync-section-card">
                <h3>{t.syncMethod1Title}</h3>
                <p>
                  1. {t.syncMethod1Step1.replace('{game}', currentGame?.display?.name || '')}<br />
                  2. {t.syncMethod1Step2}<br />
                  3. {t.syncMethod1Step3}
                </p>

                <button
                  className="btn-primary-play"
                  style={{ padding: '10px 24px', fontSize: 13, marginTop: 10 }}
                  onClick={handleSyncFromCache}
                  disabled={syncing}
                >
                  <RotateCw size={15} className={syncing ? 'spinning' : ''} />
                  <span>{syncing ? t.syncingManual : t.btnSyncFromCache}</span>
                </button>
              </div>

              <div className="sync-section-card" style={{ marginTop: 16 }}>
                <h3>{t.syncMethod2Title}</h3>
                <p>
                  {t.syncMethod2Desc}
                </p>

                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="https://gs.hoyoverse.com/.../getGachaLog?authkey=..."
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                  />
                  <button
                    className="btn-secondary"
                    onClick={handleSyncManual}
                    disabled={syncing || !customUrl.trim()}
                  >
                    {t.btnSyncManual}
                  </button>
                </div>
              </div>

              {syncStatus && (
                <div
                  style={{
                    marginTop: 16,
                    padding: '12px 16px',
                    borderRadius: 8,
                    background: syncStatus.includes('Thất bại') || syncStatus.includes('Failed')
                      ? 'rgba(239, 68, 68, 0.15)'
                      : 'rgba(245, 179, 36, 0.15)',
                    border: `1px solid ${
                      syncStatus.includes('Thất bại') || syncStatus.includes('Failed')
                        ? 'rgba(239, 68, 68, 0.3)'
                        : 'rgba(245, 179, 36, 0.3)'
                    }`,
                    fontSize: 13,
                    color: '#fff',
                  }}
                >
                  {syncStatus}
                </div>
              )}

              <div className="cookie-guide" style={{ marginTop: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <HelpCircle size={15} color="var(--accent-yellow)" />
                  <strong>{t.dbSpecTitle}</strong>
                </div>
                <span>
                  {t.dbSpecDesc} <code>{overview?.db_path}</code>.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
