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
  pickGameFolder,
  getLocalGameVersion,
  isGameRunning,
  openOfficialLauncher,
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
import { GameSettingsModal } from './components/modals/GameSettingsModal';
import { EndfieldBuildTab } from './components/endfield/EndfieldBuildTab';
import { launchGameAdvanced } from './services/gameSettingsApi';
import { Gift, Sparkles, MessageSquare, Globe, Crosshair } from 'lucide-react';
import {
  ENDFIELD_GAME_ID,
  getEndfieldGameDef,
  fetchEndfieldBackgrounds,
  fetchEndfieldContent,
  fetchEndfieldPackages,
} from './services/endfieldApi';
import { setDiscordPresence, getGameWebIconUrl } from './services/discordApi';
import { getT } from './i18n/translations';
import './App.css';

const DEFAULT_CONFIG: AppConfig = {
  region: 'os',
  language: 'vi-vn',
  soundEnabled: false,
  gamePaths: {},
  cookie: '',
  autoCheckin: true,
};

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
  const [localGameVersion, setLocalGameVersion] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeBannerIdx, setActiveBannerIdx] = useState<number>(0);
  const [endfieldSubView, setEndfieldSubView] = useState<'overview' | 'build'>('build');

  // Modals
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showGameSettings, setShowGameSettings] = useState<boolean>(false);
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

        // Exclude unwanted spin-offs: Petit Planet (hyg) & Honkai Nexus Anima (abc)
        const filteredGameList = gameList.filter(
          (g) => !['hyg', 'abc'].some((prefix) => g.biz.toLowerCase().startsWith(prefix))
        );

        // Prioritize major games at the top
        const PRIORITY_ORDER = ['nap', 'hkrpg', 'hk4e', 'endfield', 'bh3'];
        const getPriority = (biz: string) => {
          const idx = PRIORITY_ORDER.findIndex((prefix) => biz.includes(prefix));
          return idx !== -1 ? idx : 99;
        };

        const endfieldDef = getEndfieldGameDef(config.language);
        const allGames = [...filteredGameList, endfieldDef].sort(
          (a, b) => getPriority(a.biz) - getPriority(b.biz)
        );

        setGames(allGames);
        if (allGames.length > 0 && (!selectedGameId || !allGames.some((g) => g.id === selectedGameId))) {
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
          pkgPromise = fetchEndfieldPackages(config.region, localGameVersion);
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
  }, [selectedGameId, config.region, config.language, localGameVersion]);

  const currentGame = games.find((g) => g.id === selectedGameId);
  const t = getT(config.language);

  // Update Discord RPC reactively based on state (browsing, build guide, in game)
  useEffect(() => {
    if (!currentGame) return;
    const gameKey = currentGame.biz || currentGame.display?.name || currentGame.id || '';
    const gameName = currentGame.display?.name || 'AIO Launcher';
    const gameIconUrl = getGameWebIconUrl(gameKey, currentGame.display?.icon?.url);

    let details = `Browsing ${gameName}`;
    let state = 'In Launcher';

    if (isRunning) {
      details = `Playing ${gameName}`;
      state = 'In Game';
    } else if (currentGame.id === ENDFIELD_GAME_ID && endfieldSubView === 'build') {
      details = 'Talos-II Archive (v1.6)';
      state = 'Viewing Operator Build Guide';
    }

    setDiscordPresence(
      gameKey,
      details,
      state,
      gameIconUrl,
      gameName
    );
  }, [selectedGameId, currentGame, isRunning, endfieldSubView]);

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

  // Poll running status
  useEffect(() => {
    let active = true;
    if (!currentPath || !currentGame) {
      setIsRunning(false);
      return;
    }

    const check = () => {
      isGameRunning(currentPath, currentGame.biz || currentGame.id || '')
        .then((running) => {
          if (active) setIsRunning(running);
        })
        .catch(() => {
          if (active) setIsRunning(false);
        });
    };

    check();
    const interval = setInterval(check, 2500);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [currentPath, currentGame]);

  // Detect local installed game version
  useEffect(() => {
    let active = true;
    if (!currentPath || !currentGame) {
      setLocalGameVersion(null);
      return;
    }

    const refreshVersion = () => {
      getLocalGameVersion(currentPath, currentGame.biz || currentGame.id || '')
        .then((ver) => {
          if (active) setLocalGameVersion(ver);
        })
        .catch((err) => {
          console.warn('Không đọc được phiên bản game nội bộ:', err);
          if (active) setLocalGameVersion(null);
        });
    };

    refreshVersion();

    const onFocus = () => refreshVersion();
    window.addEventListener('focus', onFocus);

    return () => {
      active = false;
      window.removeEventListener('focus', onFocus);
    };
  }, [currentPath, currentGame]);

  const hasUpdateAction = Boolean(
    currentPath &&
    localGameVersion &&
    packageData?.main?.version &&
    isOlderVersion(localGameVersion, packageData.main.version)
  );

  const handleUpdateGame = async () => {
    if (currentPath && currentGame) {
      const biz = currentGame.biz || currentGame.id || '';
      const opened = await openOfficialLauncher(currentPath, biz);
      if (opened) return;
    }
    setShowPkgModal(true);
  };

  // Launch Game
  const handleLaunchGame = async () => {
    if (!currentPath) {
      try {
        const path = await pickGameFolder();
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
      const customArgs = config.gameLaunchArgs?.[selectedGameId] || '';
      const borderless = config.gameBorderless?.[selectedGameId] || false;
      const forceDx12 = config.gameForceDx12?.[selectedGameId] || false;

      // Launch with custom arguments / borderless if configured
      if (customArgs || borderless || forceDx12) {
        await launchGameAdvanced(
          currentPath,
          {
            width: 0,
            height: 0,
            fullscreen_mode: borderless ? 3 : 1,
            borderless,
            custom_args: customArgs,
          },
          forceDx12,
          currentGame?.biz || currentGame?.id
        );
      } else {
        await launchGame(currentPath, currentGame?.biz || currentGame?.id);
      }
      setIsRunning(true);
    } catch (err) {
      console.warn('Lỗi khởi chạy trực tiếp, thử mở qua launcher gốc:', err);
      if (currentPath && currentGame) {
        const biz = currentGame.biz || currentGame.id || '';
        const opened = await openOfficialLauncher(currentPath, biz);
        if (opened) return;
      }
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
        currentGame={currentGame}
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
          {currentGame?.id === ENDFIELD_GAME_ID && endfieldSubView === 'build' ? (
            <EndfieldBuildTab onBackToOverview={() => setEndfieldSubView('overview')} />
          ) : (
            <>
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
                  <h1 className="game-name">{currentGame?.display?.name || 'AIO Launcher'}</h1>
                )}
                {currentGame?.display?.introduction && (
                  <p className="game-desc">{currentGame.display.introduction}</p>
                )}
              </div>

              <div className="quick-tools">
                {currentGame?.id === ENDFIELD_GAME_ID ? (
                  <>
                    <button
                      type="button"
                      className="tool-btn a9e-build-toggle-btn"
                      onClick={() => setEndfieldSubView('build')}
                      title="Mở Tab Hướng Dẫn Build Operator & Trang Bị AIC Toàn Diện (v1.6)"
                    >
                      <Crosshair size={15} color="#ffd600" />
                      <span>Hướng Dẫn Build (v1.6)</span>
                      <span className="a9e-build-badge-pill">META</span>
                    </button>
                    <a
                      href="https://endfield.gryphline.com"
                      target="_blank"
                      rel="noreferrer"
                      className="tool-btn"
                    >
                      <Globe size={15} color="#f5b324" />
                      <span>{t.homeWeb}</span>
                    </a>
                    <a
                      href="https://www.skport.com"
                      target="_blank"
                      rel="noreferrer"
                      className="tool-btn"
                    >
                      <MessageSquare size={15} color="#38bdf8" />
                      <span>{t.community}</span>
                    </a>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className="tool-btn"
                      onClick={() => setShowCheckinModal(true)}
                      title={t.dailyCheckinTip}
                    >
                      <Gift size={15} color="#f5b324" />
                      <span>{t.dailyCheckinBtn}</span>
                      {checkinStatus?.is_sign ? (
                        <span className="checkin-badge done">{t.checkinDoneBadge}</span>
                      ) : config.cookie ? (
                        <span className="checkin-badge pending">{t.checkinPendingBadge}</span>
                      ) : null}
                    </button>

                    <button
                      type="button"
                      className="tool-btn"
                      onClick={() => setShowRollModal(true)}
                      title={t.rollTrackerTip}
                    >
                      <Sparkles size={15} color="#38bdf8" />
                      <span>{t.rollTrackerBtn}</span>
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
              language={config.language}
              onSelectBannerIdx={setActiveBannerIdx}
            />

            {/* Bottom Actions */}
            <BottomBar
              packageData={packageData}
              currentPath={currentPath}
              language={config.language}
              localVersion={localGameVersion}
              isRunning={isRunning}
              onOpenSettings={() => setShowSettings(true)}
              onOpenGameSettings={() => setShowGameSettings(true)}
              onOpenPackageModal={() => setShowPkgModal(true)}
              onOpenFolder={handleOpenFolder}
              onLaunchGame={hasUpdateAction ? handleUpdateGame : handleLaunchGame}
            />
          </div>
        </>
      )}
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
          language={config.language}
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
          language={config.language}
          currentPath={currentPath}
          gameBiz={currentGame?.biz || currentGame?.id || ''}
          onClose={() => setShowPkgModal(false)}
        />
      )}

      {showRollModal && (
        <RollTrackerModal
          currentGame={currentGame}
          gameExePath={currentPath}
          language={config.language}
          onClose={() => setShowRollModal(false)}
        />
      )}

      {showGameSettings && currentGame && (
        <GameSettingsModal
          game={currentGame}
          language={config.language}
          customArgs={config.gameLaunchArgs?.[selectedGameId] || ''}
          borderless={config.gameBorderless?.[selectedGameId] || false}
          forceDx12={config.gameForceDx12?.[selectedGameId] || false}
          onClose={() => setShowGameSettings(false)}
          onSaveLauncherConfig={(customArgs, borderless, forceDx12) => {
            setConfig((prev) => ({
              ...prev,
              gameLaunchArgs: {
                ...(prev.gameLaunchArgs || {}),
                [selectedGameId]: customArgs,
              },
              gameBorderless: {
                ...(prev.gameBorderless || {}),
                [selectedGameId]: borderless,
              },
              gameForceDx12: {
                ...(prev.gameForceDx12 || {}),
                [selectedGameId]: forceDx12,
              },
            }));
          }}
        />
      )}
    </div>
  );
}
