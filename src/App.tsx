import { useState, useEffect, useRef } from 'react';
import {
  fetchGames,
  fetchGameBackgrounds,
  fetchGameContent,
  fetchGamePackages,
} from './services/hoyoApi';
import {
  getCheckinInfo,
  executeCheckin,
  executeCheckinAll,
} from './services/checkinApi';
import {
  launchGame,
  openFolder,
  pickGameFile,
} from './services/nativeApi';
import {
  HoyoGame,
  HoyoBackground,
  HoyoBanner,
  HoyoPost,
  HoyoGamePackageResult,
  AppConfig,
  CheckinStatus,
} from './types';
import { Titlebar } from './components/Titlebar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { BottomBar } from './components/BottomBar';
import { CheckinModal } from './components/modals/CheckinModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { PackageModal } from './components/modals/PackageModal';
import { RollTrackerModal } from './components/modals/RollTrackerModal';
import { Gift, Sparkles, MessageSquare, Globe } from 'lucide-react';
import {
  ENDFIELD_GAME_DEF,
  ENDFIELD_GAME_ID,
  fetchEndfieldBackgrounds,
  fetchEndfieldContent,
  fetchEndfieldPackages,
} from './services/endfieldApi';
import './App.css';

const DEFAULT_CONFIG: AppConfig = {
  region: 'os',
  language: 'vi-vn',
  soundEnabled: false,
  gamePaths: {},
  cookie: '',
  autoCheckin: true,
};

export default function App() {
  const [config, setConfig] = useState<AppConfig>(() => {
    try {
      const saved = localStorage.getItem('void0_config');
      return saved ? { ...DEFAULT_CONFIG, ...JSON.parse(saved) } : DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  });

  const [games, setGames] = useState<HoyoGame[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<string>('');
  const [backgrounds, setBackgrounds] = useState<HoyoBackground[]>([]);
  const [banners, setBanners] = useState<HoyoBanner[]>([]);
  const [posts, setPosts] = useState<HoyoPost[]>([]);
  const [packageData, setPackageData] = useState<HoyoGamePackageResult | null>(null);
  const [activeBannerIdx, setActiveBannerIdx] = useState<number>(0);

  // Modals
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showPkgModal, setShowPkgModal] = useState<boolean>(false);
  const [showCheckinModal, setShowCheckinModal] = useState<boolean>(false);
  const [showRollModal, setShowRollModal] = useState<boolean>(false);

  // Check-in state
  const [checkinStatus, setCheckinStatus] = useState<CheckinStatus | null>(null);
  const [checkinLoading, setCheckinLoading] = useState<boolean>(false);
  const [batchLoading, setBatchLoading] = useState<boolean>(false);
  const [checkinMessage, setCheckinMessage] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const autoCheckinDoneRef = useRef<boolean>(false);

  // Save config
  useEffect(() => {
    localStorage.setItem('void0_config', JSON.stringify(config));
  }, [config]);

  // Load games list
  useEffect(() => {
    let isMounted = true;
    async function loadGames() {
      try {
        const gameList = await fetchGames(config.region, config.language);
        if (!isMounted) return;
        const allGames = [...gameList, ENDFIELD_GAME_DEF];
        setGames(allGames);
        if (allGames.length > 0 && !selectedGameId) {
          const zzz = allGames.find(
            (g) => g.biz.includes('nap') || g.display?.name?.toLowerCase().includes('zenless')
          );
          setSelectedGameId(zzz ? zzz.id : allGames[0].id);
        }
      } catch (err) {
        console.error('Lỗi tải danh sách game:', err);
      }
    }
    loadGames();
    return () => {
      isMounted = false;
    };
  }, [config.region, config.language]);

  // Load selected game details
  useEffect(() => {
    if (!selectedGameId) return;

    let isMounted = true;
    async function loadDetails() {
      try {
        let bgPromise: Promise<HoyoBackground[]>;
        let contentPromise: Promise<{ banners: HoyoBanner[]; posts: HoyoPost[] }>;
        let pkgPromise: Promise<HoyoGamePackageResult>;

        if (selectedGameId === ENDFIELD_GAME_ID) {
          bgPromise = fetchEndfieldBackgrounds(config.region, config.language);
          contentPromise = fetchEndfieldContent(config.region, config.language);
          pkgPromise = fetchEndfieldPackages(config.region);
        } else {
          bgPromise = fetchGameBackgrounds(config.region, config.language, selectedGameId);
          contentPromise = fetchGameContent(config.region, config.language, selectedGameId);
          pkgPromise = fetchGamePackages(config.region, config.language, selectedGameId);
        }

        const [bgRes, contentRes, pkgRes] = await Promise.allSettled([
          bgPromise,
          contentPromise,
          pkgPromise,
        ]);

        if (!isMounted) return;

        if (bgRes.status === 'fulfilled') setBackgrounds(bgRes.value);
        if (contentRes.status === 'fulfilled') {
          setBanners(contentRes.value.banners);
          setPosts(contentRes.value.posts);
          setActiveBannerIdx(0);
        }
        if (pkgRes.status === 'fulfilled') setPackageData(pkgRes.value);
      } catch (err) {
        console.error('Lỗi tải thông tin game:', err);
      }
    }

    loadDetails();
    return () => {
      isMounted = false;
    };
  }, [selectedGameId, config.region, config.language]);

  const currentGame = games.find((g) => g.id === selectedGameId);

  // Check-in info
  const loadCheckin = async (biz: string) => {
    const status = await getCheckinInfo(biz, config.cookie, config.language);
    setCheckinStatus(status);
  };

  useEffect(() => {
    if (currentGame?.biz && currentGame.id !== ENDFIELD_GAME_ID && config.cookie) {
      loadCheckin(currentGame.biz);
    } else {
      setCheckinStatus(null);
    }
  }, [selectedGameId, config.cookie]);

  // Auto check-in on startup
  useEffect(() => {
    if (!config.autoCheckin || !config.cookie || autoCheckinDoneRef.current) return;
    autoCheckinDoneRef.current = true;

    async function runAuto() {
      await executeCheckinAll(config.cookie, config.language);
      if (currentGame?.biz) loadCheckin(currentGame.biz);
    }
    runAuto();
  }, [config.autoCheckin, config.cookie, currentGame?.biz]);

  // Manual Check-in Single
  const handleSingleCheckin = async () => {
    if (!currentGame?.biz) return;
    setCheckinLoading(true);
    setCheckinMessage('');
    try {
      const res = await executeCheckin(currentGame.biz, config.cookie, config.language);
      setCheckinMessage(res.message);
      loadCheckin(currentGame.biz);
    } finally {
      setCheckinLoading(false);
    }
  };

  // Manual Check-in All
  const handleBatchCheckin = async () => {
    setBatchLoading(true);
    setCheckinMessage('');
    try {
      const res = await executeCheckinAll(config.cookie, config.language);
      setCheckinMessage(`Đã hoàn tất điểm danh cho ${res.successCount}/${res.total} tựa game!`);
      if (currentGame?.biz) loadCheckin(currentGame.biz);
    } finally {
      setBatchLoading(false);
    }
  };

  // Banner rotation
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setActiveBannerIdx((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const currentBg = backgrounds[0];
  const currentPath = config.gamePaths[selectedGameId] || '';

  // Launch Game
  const handleLaunchGame = async () => {
    if (!currentPath) {
      try {
        const path = await pickGameFile();
        if (path && selectedGameId) {
          setConfig((prev) => ({
            ...prev,
            gamePaths: { ...prev.gamePaths, [selectedGameId]: path },
          }));
        }
      } catch {
        setShowSettings(true);
      }
      return;
    }
    try {
      await launchGame(currentPath);
    } catch (err) {
      alert(`Lỗi khởi động game: ${err}`);
    }
  };

  // Open Game Folder
  const handleOpenFolder = async () => {
    if (!currentPath) return;
    const dir = currentPath.substring(0, currentPath.lastIndexOf('\\')) || currentPath;
    try {
      await openFolder(dir);
    } catch (err) {
      alert(`Lỗi mở thư mục: ${err}`);
    }
  };

  // External links
  const getGameLinks = (biz: string) => {
    if (biz.includes('nap')) {
      return {
        forum: 'https://www.hoyolab.com/circles/8',
      };
    }
    if (biz.includes('hk4e')) {
      return {
        forum: 'https://www.hoyolab.com/circles/2',
      };
    }
    if (biz.includes('hkrpg')) {
      return {
        forum: 'https://www.hoyolab.com/circles/6',
      };
    }
    return {
      forum: 'https://www.hoyolab.com',
    };
  };

  const links = getGameLinks(currentGame?.biz || '');

  return (
    <div className="launcher-container">
      {/* Titlebar */}
      <Titlebar
        config={config}
        onChangeConfig={setConfig}
        onOpenSettings={() => setShowSettings(true)}
      />

      <div className="launcher-body">
        {/* Sidebar */}
        <Sidebar
          games={games}
          selectedGameId={selectedGameId}
          onSelectGame={setSelectedGameId}
        />

        {/* Main Content Area */}
        <main className="content-area">
          <div className="bg-layer">
            {currentBg?.video?.url ? (
              <video
                ref={videoRef}
                className="bg-video"
                src={currentBg.video.url}
                autoPlay
                loop
                muted={!config.soundEnabled}
                playsInline
              />
            ) : currentBg?.background?.url ? (
              <img className="bg-image" src={currentBg.background.url} alt="Background" />
            ) : (
              <div style={{ width: '100%', height: '100%', backgroundColor: '#11151c' }} />
            )}
            <div className="bg-overlay" />
          </div>

          <div className="viewport-content">
            {/* Header info & tools */}
            <div className="game-header">
              <div className="game-title-group">
                {currentGame?.id === ENDFIELD_GAME_ID && currentGame.display?.logo?.url ? (
                  <img
                    className="game-logo"
                    src={currentGame.display.logo.url}
                    alt={currentGame.display?.name}
                    style={{ maxWidth: 280, height: 'auto', marginBottom: 8 }}
                  />
                ) : currentBg?.theme?.url ? (
                  <img
                    className="game-logo"
                    src={currentBg.theme.url}
                    alt={currentGame?.display?.name}
                  />
                ) : (
                  <h1 className="game-name">{currentGame?.display?.name || 'Void0 Launcher'}</h1>
                )}
                {currentGame?.display?.introduction && (
                  <p className="game-desc">{currentGame.display.introduction}</p>
                )}
              </div>

              <div className="quick-tools">
                {currentGame?.id === ENDFIELD_GAME_ID ? (
                  <>
                    <a
                      href="https://endfield.gryphline.com"
                      target="_blank"
                      rel="noreferrer"
                      className="tool-btn"
                    >
                      <Globe size={15} color="#f5b324" />
                      <span>Trang Chủ</span>
                    </a>
                    <a
                      href="https://www.skport.com"
                      target="_blank"
                      rel="noreferrer"
                      className="tool-btn"
                    >
                      <MessageSquare size={15} color="#38bdf8" />
                      <span>SKPORT</span>
                    </a>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className="tool-btn"
                      onClick={() => setShowCheckinModal(true)}
                      title="Điểm danh nhận quà trực tiếp trên Launcher"
                    >
                      <Gift size={15} color="#f5b324" />
                      <span>Điểm Danh</span>
                      {checkinStatus?.is_sign ? (
                        <span className="checkin-badge done">✓ Đã nhận</span>
                      ) : config.cookie ? (
                        <span className="checkin-badge pending">● Chưa nhận</span>
                      ) : null}
                    </button>

                    <button
                      type="button"
                      className="tool-btn"
                      onClick={() => setShowRollModal(true)}
                      title="Theo dõi lịch sử roll & số nháy Pity từ Database cục bộ"
                    >
                      <Sparkles size={15} color="#38bdf8" />
                      <span>Check Lượt Roll</span>
                    </button>

                    <a href={links.forum} target="_blank" rel="noreferrer" className="tool-btn">
                      <MessageSquare size={15} color="#f472b6" />
                      <span>HoYoLAB</span>
                    </a>
                  </>
                )}
              </div>
            </div>

            {/* Banner & News Dashboard */}
            <Dashboard
              banners={banners}
              posts={posts}
              activeBannerIdx={activeBannerIdx}
              onSelectBannerIdx={setActiveBannerIdx}
            />

            {/* Bottom Actions */}
            <BottomBar
              packageData={packageData}
              currentPath={currentPath}
              onOpenSettings={() => setShowSettings(true)}
              onOpenPackageModal={() => setShowPkgModal(true)}
              onOpenFolder={handleOpenFolder}
              onLaunchGame={handleLaunchGame}
            />
          </div>
        </main>
      </div>

      {/* Modals */}
      {showCheckinModal && (
        <CheckinModal
          currentGame={currentGame}
          checkinStatus={checkinStatus}
          cookie={config.cookie}
          autoCheckin={config.autoCheckin}
          checkinLoading={checkinLoading}
          batchLoading={batchLoading}
          checkinMessage={checkinMessage}
          onClose={() => setShowCheckinModal(false)}
          onSaveCookie={(cookie) => {
            setConfig({ ...config, cookie });
            if (currentGame?.biz) loadCheckin(currentGame.biz);
          }}
          onToggleAutoCheckin={(autoCheckin) => setConfig({ ...config, autoCheckin })}
          onSingleCheckin={handleSingleCheckin}
          onBatchCheckin={handleBatchCheckin}
        />
      )}

      {showSettings && (
        <SettingsModal
          currentGame={currentGame}
          currentPath={currentPath}
          region={config.region}
          language={config.language}
          onClose={() => setShowSettings(false)}
          onSave={(path, region, language) => {
            if (selectedGameId) {
              setConfig({
                ...config,
                region,
                language,
                gamePaths: { ...config.gamePaths, [selectedGameId]: path },
              });
            } else {
              setConfig({ ...config, region, language });
            }
            setShowSettings(false);
          }}
        />
      )}

      {showPkgModal && packageData && (
        <PackageModal
          packageData={packageData}
          onClose={() => setShowPkgModal(false)}
        />
      )}

      {showRollModal && (
        <RollTrackerModal
          currentGame={currentGame}
          gameExePath={currentPath}
          onClose={() => setShowRollModal(false)}
        />
      )}
    </div>
  );
}
