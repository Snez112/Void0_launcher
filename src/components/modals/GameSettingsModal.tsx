import React, { useState, useEffect } from 'react';
import { X, Monitor, Sliders, Check, AlertCircle } from 'lucide-react';
import { HoyoGame, GameGraphicsConfig, HsrGraphicsSettings } from '../../types';
import { getT } from '../../i18n/translations';
import { getGameGraphicsSettings, saveGameGraphicsSettings, getSystemResolutions } from '../../services/gameSettingsApi';
import { CustomSelect } from '../common/CustomSelect';

interface GameSettingsModalProps {
  game: HoyoGame;
  language: string;
  customArgs?: string;
  borderless?: boolean;
  forceDx12?: boolean;
  onClose: () => void;
  onSaveLauncherConfig: (customArgs: string, borderless: boolean, forceDx12: boolean) => void;
}

const RESOLUTION_PRESETS = [
  { label: '3840 × 2160 (4K UHD)', w: 3840, h: 2160 },
  { label: '2560 × 1440 (2K QHD)', w: 2560, h: 1440 },
  { label: '1920 × 1080 (1080p FHD)', w: 1920, h: 1080 },
  { label: '1680 × 1050 (16:10)', w: 1680, h: 1050 },
  { label: '1600 × 1024 (16:10)', w: 1600, h: 1024 },
  { label: '1600 × 900 (HD+)', w: 1600, h: 900 },
  { label: '1440 × 900 (16:10)', w: 1440, h: 900 },
  { label: '1366 × 768 (HD)', w: 1366, h: 768 },
  { label: '1280 × 720 (720p HD)', w: 1280, h: 720 },
];

function getAspectLabel(w: number, h: number): string {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const div = gcd(w, h);
  const rw = w / div;
  const rh = h / div;
  if ((rw === 16 && rh === 9) || (rw === 683 && rh === 384)) return '16:9';
  if (rw === 16 && rh === 10) return '16:10';
  if (rw === 4 && rh === 3) return '4:3';
  if (rw === 5 && rh === 4) return '5:4';
  if (rw === 21 && rh === 9) return '21:9';
  return `${rw}:${rh}`;
}

export const GameSettingsModal: React.FC<GameSettingsModalProps> = ({
  game,
  language,
  customArgs = '',
  borderless = false,
  forceDx12 = false,
  onClose,
  onSaveLauncherConfig,
}) => {
  const t = getT(language);
  const [activeTab, setActiveTab] = useState<'display' | 'graphics'>('display');
  const [loading, setLoading] = useState<boolean>(true);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Display State
  const [width, setWidth] = useState<number>(1920);
  const [height, setHeight] = useState<number>(1080);
  const [isCustomResolution, setIsCustomResolution] = useState<boolean>(false);
  const [fullscreenMode, setFullscreenMode] = useState<number>(1); // 1: full, 3: windowed
  const [isBorderless, setIsBorderless] = useState<boolean>(borderless);
  const [isForceDx12, setIsForceDx12] = useState<boolean>(forceDx12);
  const [argsInput, setArgsInput] = useState<string>(customArgs);

  // HSR In-game Graphics State
  const [hsrGraphics, setHsrGraphics] = useState<HsrGraphicsSettings>({
    FPS: 60,
    EnableVSync: true,
    RenderScale: 1.0,
    ResolutionQuality: 3,
    ShadowQuality: 3,
    LightQuality: 3,
    CharacterQuality: 3,
    EnvDetailQuality: 3,
    ReflectionQuality: 3,
    SFXQuality: 3,
    BloomQuality: 3,
    AAMode: 1,
    DlssQuality: 0,
  });

  const isHsr =
    game.biz?.toLowerCase().includes('hkrpg') ||
    game.display?.name?.toLowerCase().includes('star rail') ||
    false;

  const [systemResolutions, setSystemResolutions] = useState<Array<{ width: number; height: number }>>([]);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [res, sysRes] = await Promise.all([
          getGameGraphicsSettings(game.biz || game.id),
          getSystemResolutions().catch(() => []),
        ]);
        if (sysRes && sysRes.length > 0) {
          setSystemResolutions(sysRes);
        }
        const w = res.width > 0 ? res.width : 1920;
        const h = res.height > 0 ? res.height : 1080;
        setWidth(w);
        setHeight(h);
        const matched = RESOLUTION_PRESETS.some((p) => p.w === w && p.h === h);
        setIsCustomResolution(!matched);

        if (res.fullscreen_mode) setFullscreenMode(res.fullscreen_mode);
        if (res.hsr_graphics) {
          setHsrGraphics(res.hsr_graphics);
        }
      } catch (err) {
        console.warn('Lỗi đọc registry:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [game.biz, game.id]);

  const handleSave = async () => {
    try {
      setErrorMsg('');
      const finalWidth = width > 0 ? width : 1920;
      const finalHeight = height > 0 ? height : 1080;

      const payload: GameGraphicsConfig = {
        width: finalWidth,
        height: finalHeight,
        fullscreen_mode: isBorderless ? 3 : fullscreenMode,
        borderless: isBorderless,
        custom_args: argsInput,
        hsr_graphics: isHsr ? hsrGraphics : null,
      };

      await saveGameGraphicsSettings(game.biz || game.id, payload);
      onSaveLauncherConfig(argsInput, isBorderless, isForceDx12);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err: any) {
      setErrorMsg(String(err));
    }
  };

  const availableResolutions = React.useMemo(() => {
    if (systemResolutions.length > 0) {
      return systemResolutions.map((r) => ({
        w: r.width,
        h: r.height,
        label: `${r.width} × ${r.height} (${getAspectLabel(r.width, r.height)})`,
      }));
    }
    return RESOLUTION_PRESETS;
  }, [systemResolutions]);

  const handlePresetChange = (val: string) => {
    if (val === 'custom') {
      setIsCustomResolution(true);
      return;
    }
    const found = availableResolutions.find((p) => `${p.w}x${p.h}` === val);
    if (found) {
      setIsCustomResolution(false);
      setWidth(found.w);
      setHeight(found.h);
    }
  };

  const currentResolutionValue = isCustomResolution ? 'custom' : `${width}x${height}`;

  const isCurrentSupported =
    systemResolutions.length === 0 ||
    systemResolutions.some((r) => r.width === width && r.height === height);

  const fallbackCandidate = systemResolutions.find((r) => r.width === width);

  const resolutionOptions = [
    ...availableResolutions.map((p) => ({
      value: `${p.w}x${p.h}`,
      label: p.label,
    })),
    {
      value: 'custom',
      label: t.customResolution || 'Tùy chỉnh (W × H)',
    },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        style={{ maxWidth: 680, maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sliders size={18} color="var(--primary)" />
            <span>{t.gameSettingsTitle.replace('{game}', game.display?.name || '')}</span>
          </div>
          <button className="win-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Tab Selector */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--border)',
            padding: '0 20px',
            background: 'var(--bg-card)',
            gap: 16,
          }}
        >
          <button
            style={{
              padding: '12px 6px',
              border: 'none',
              borderBottom: activeTab === 'display' ? '2px solid var(--primary)' : '2px solid transparent',
              background: 'transparent',
              color: activeTab === 'display' ? 'var(--text)' : 'var(--text-dim)',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
            onClick={() => setActiveTab('display')}
          >
            <Monitor size={15} />
            {t.tabDisplay}
          </button>

          {isHsr && (
            <button
              style={{
                padding: '12px 6px',
                border: 'none',
                borderBottom: activeTab === 'graphics' ? '2px solid var(--primary)' : '2px solid transparent',
                background: 'transparent',
                color: activeTab === 'graphics' ? 'var(--text)' : 'var(--text-dim)',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
              onClick={() => setActiveTab('graphics')}
            >
              <Sliders size={15} />
              {t.tabGraphics}
            </button>
          )}
        </div>

        {/* Body */}
        <div className="modal-body" style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-dim)' }}>
              Đang tải cài đặt từ Registry...
            </div>
          ) : (
            <>
              {activeTab === 'display' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {/* Resolution */}
                  <div className="form-group">
                    <label>{t.resolutionLabel}:</label>
                    <CustomSelect
                      value={currentResolutionValue}
                      options={resolutionOptions}
                      onChange={(val) => handlePresetChange(val as string)}
                    />

                    {isCustomResolution && (
                      <div
                        style={{
                          display: 'flex',
                          gap: 10,
                          marginTop: 10,
                          alignItems: 'center',
                          background: 'rgba(255, 255, 255, 0.03)',
                          padding: '10px 14px',
                          borderRadius: 8,
                          border: '1px dashed rgba(245, 179, 36, 0.35)',
                        }}
                      >
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <span style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 600 }}>
                            Chiều rộng (Width px)
                          </span>
                          <input
                            type="number"
                            className="form-input"
                            style={{ width: '100%' }}
                            value={width || ''}
                            onChange={(e) => setWidth(parseInt(e.target.value) || 0)}
                            placeholder="1920"
                          />
                        </div>
                        <span style={{ marginTop: 18, color: 'var(--text-dim)', fontWeight: 700 }}>×</span>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <span style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 600 }}>
                            Chiều cao (Height px)
                          </span>
                          <input
                            type="number"
                            className="form-input"
                            style={{ width: '100%' }}
                            value={height || ''}
                            onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
                            placeholder="1080"
                          />
                        </div>
                      </div>
                    )}

                    {!isCurrentSupported && width > 0 && height > 0 && (
                      <div
                        style={{
                          marginTop: 10,
                          padding: '10px 12px',
                          borderRadius: 8,
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.25)',
                          fontSize: 12,
                          color: '#fca5a5',
                          lineHeight: 1.5,
                        }}
                      >
                        <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                          <AlertCircle size={15} color="#ef4444" />
                          <span>Màn hình không hỗ trợ profile {width}×{height}</span>
                        </div>
                        <div>
                          Driver màn hình hiện tại không có độ phân giải {width}×{height}. Engine của Star Rail sẽ tự động ép về {fallbackCandidate ? `${fallbackCandidate.width}×${fallbackCandidate.height}` : 'độ phân giải gần nhất'} khi game load xong.
                        </div>
                        <div style={{ marginTop: 4, color: '#fecaca', fontSize: 11.5 }}>
                          💡 Khuyên dùng: Chọn độ phân giải có sẵn trong danh sách trên, hoặc tạo Custom Resolution trong NVIDIA Control Panel / Intel Graphics.
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Display Mode */}
                  <div className="form-group">
                    <label>{t.displayModeLabel}:</label>
                    <CustomSelect
                      value={fullscreenMode}
                      disabled={isBorderless}
                      options={[
                        { value: 1, label: t.modeFullscreen },
                        { value: 3, label: t.modeWindowed },
                      ]}
                      onChange={(val) => setFullscreenMode(val as number)}
                    />
                  </div>

                  {/* Borderless */}
                  <div
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      padding: '12px 14px',
                      borderRadius: 8,
                      border: '1px solid var(--border)',
                    }}
                  >
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 600 }}>
                      <input
                        type="checkbox"
                        checked={isBorderless}
                        onChange={(e) => setIsBorderless(e.target.checked)}
                      />
                      {t.borderlessLabel}
                    </label>
                    <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 4, marginLeft: 24 }}>
                      {t.borderlessTip}
                    </div>
                  </div>

                  {/* DirectX 12 */}
                  <div
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      padding: '12px 14px',
                      borderRadius: 8,
                      border: '1px solid var(--border)',
                    }}
                  >
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 600 }}>
                      <input
                        type="checkbox"
                        checked={isForceDx12}
                        onChange={(e) => setIsForceDx12(e.target.checked)}
                      />
                      {t.dx12Label}
                    </label>
                    <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 4, marginLeft: 24 }}>
                      {t.dx12Tip}
                    </div>
                  </div>

                  {/* Custom Command Line Args */}
                  <div className="form-group">
                    <label>{t.launchArgsLabel}:</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="-popupwindow"
                      value={argsInput}
                      onChange={(e) => setArgsInput(e.target.value)}
                    />
                    <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 4 }}>
                      {t.launchArgsTip}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'graphics' && isHsr && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {/* FPS Unlocker */}
                  <div
                    style={{
                      background: 'rgba(255, 215, 0, 0.06)',
                      padding: '12px 14px',
                      borderRadius: 8,
                      border: '1px solid rgba(255, 215, 0, 0.25)',
                    }}
                  >
                    <label style={{ fontWeight: 600, color: '#ffd700' }}>{t.fpsLabel}:</label>
                    <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                      {[30, 60, 120].map((fpsVal) => (
                        <button
                          key={fpsVal}
                          type="button"
                          style={{
                            flex: 1,
                            padding: '8px 0',
                            borderRadius: 6,
                            border: hsrGraphics.FPS === fpsVal ? '1px solid var(--primary)' : '1px solid var(--border)',
                            background: hsrGraphics.FPS === fpsVal ? 'var(--primary)' : 'rgba(0,0,0,0.3)',
                            color: hsrGraphics.FPS === fpsVal ? '#fff' : 'var(--text)',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                          onClick={() => setHsrGraphics({ ...hsrGraphics, FPS: fpsVal })}
                        >
                          {fpsVal} FPS {fpsVal === 120 && '✦'}
                        </button>
                      ))}
                    </div>
                    <div style={{ fontSize: 11, color: '#f3d990', marginTop: 6 }}>
                      {t.fps120Tip}
                    </div>
                  </div>

                  {/* Render Scale & V-Sync */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div className="form-group">
                      <label>{t.renderScaleLabel}: ({hsrGraphics.RenderScale}x)</label>
                      <CustomSelect
                        value={hsrGraphics.RenderScale}
                        options={[
                          { value: 0.8, label: '0.8x (Tiết kiệm)' },
                          { value: 1.0, label: '1.0x (Chuẩn 100%)' },
                          { value: 1.2, label: '1.2x' },
                          { value: 1.4, label: '1.4x (Sắc nét)' },
                          { value: 1.8, label: '1.8x' },
                          { value: 2.0, label: '2.0x (Cực nét 200%)' },
                        ]}
                        onChange={(val) =>
                          setHsrGraphics({ ...hsrGraphics, RenderScale: val as number })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>{t.vsyncLabel}:</label>
                      <CustomSelect
                        value={hsrGraphics.EnableVSync ? 1 : 0}
                        options={[
                          { value: 1, label: 'Bật (Enabled)' },
                          { value: 0, label: 'Tắt (Disabled)' },
                        ]}
                        onChange={(val) =>
                          setHsrGraphics({ ...hsrGraphics, EnableVSync: val === 1 })
                        }
                      />
                    </div>
                  </div>

                  {/* Quality Settings Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div className="form-group">
                      <label>{t.shadowQualityLabel}:</label>
                      <CustomSelect
                        value={hsrGraphics.ShadowQuality}
                        options={[
                          { value: 1, label: 'Rất thấp (Very Low)' },
                          { value: 2, label: 'Thấp (Low)' },
                          { value: 3, label: 'Trung bình (Medium)' },
                          { value: 4, label: 'Cao (High)' },
                          { value: 5, label: 'Rất cao (Very High)' },
                        ]}
                        onChange={(val) =>
                          setHsrGraphics({ ...hsrGraphics, ShadowQuality: val as number })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>{t.characterQualityLabel}:</label>
                      <CustomSelect
                        value={hsrGraphics.CharacterQuality}
                        options={[
                          { value: 2, label: 'Thấp (Low)' },
                          { value: 3, label: 'Trung bình (Medium)' },
                          { value: 4, label: 'Cao (High)' },
                        ]}
                        onChange={(val) =>
                          setHsrGraphics({ ...hsrGraphics, CharacterQuality: val as number })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>{t.lightQualityLabel}:</label>
                      <CustomSelect
                        value={hsrGraphics.LightQuality}
                        options={[
                          { value: 2, label: 'Thấp (Low)' },
                          { value: 3, label: 'Trung bình (Medium)' },
                          { value: 4, label: 'Cao (High)' },
                          { value: 5, label: 'Rất cao (Very High)' },
                        ]}
                        onChange={(val) =>
                          setHsrGraphics({ ...hsrGraphics, LightQuality: val as number })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>{t.envDetailLabel}:</label>
                      <CustomSelect
                        value={hsrGraphics.EnvDetailQuality}
                        options={[
                          { value: 2, label: 'Thấp (Low)' },
                          { value: 3, label: 'Trung bình (Medium)' },
                          { value: 4, label: 'Cao (High)' },
                          { value: 5, label: 'Rất cao (Very High)' },
                        ]}
                        onChange={(val) =>
                          setHsrGraphics({ ...hsrGraphics, EnvDetailQuality: val as number })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>{t.reflectionLabel}:</label>
                      <CustomSelect
                        value={hsrGraphics.ReflectionQuality}
                        options={[
                          { value: 1, label: 'Rất thấp (Very Low)' },
                          { value: 2, label: 'Thấp (Low)' },
                          { value: 3, label: 'Trung bình (Medium)' },
                          { value: 4, label: 'Cao (High)' },
                          { value: 5, label: 'Rất cao (Very High)' },
                        ]}
                        onChange={(val) =>
                          setHsrGraphics({ ...hsrGraphics, ReflectionQuality: val as number })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>{t.sfxQualityLabel}:</label>
                      <CustomSelect
                        value={hsrGraphics.SFXQuality}
                        options={[
                          { value: 2, label: 'Thấp (Low)' },
                          { value: 3, label: 'Trung bình (Medium)' },
                          { value: 4, label: 'Cao (High)' },
                        ]}
                        onChange={(val) =>
                          setHsrGraphics({ ...hsrGraphics, SFXQuality: val as number })
                        }
                      />
                    </div>
                  </div>

                  {/* AA Mode & DLSS */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div className="form-group">
                      <label>{t.aaModeLabel}:</label>
                      <CustomSelect
                        value={hsrGraphics.AAMode}
                        options={[
                          { value: 0, label: 'Tắt (Off)' },
                          { value: 1, label: 'TAA' },
                          { value: 2, label: 'FXAA' },
                        ]}
                        onChange={(val) =>
                          setHsrGraphics({ ...hsrGraphics, AAMode: val as number })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>{t.dlssLabel}:</label>
                      <CustomSelect
                        value={hsrGraphics.DlssQuality}
                        options={[
                          { value: 0, label: 'Tắt (Off)' },
                          { value: 1, label: 'Ultra Performance' },
                          { value: 2, label: 'Performance' },
                          { value: 3, label: 'Balanced' },
                          { value: 4, label: 'Quality' },
                          { value: 5, label: 'DLAA (Native AA)' },
                        ]}
                        onChange={(val) =>
                          setHsrGraphics({ ...hsrGraphics, DlssQuality: val as number })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {savedSuccess && (
            <div
              style={{
                marginTop: 14,
                padding: '10px 14px',
                borderRadius: 6,
                background: 'rgba(34, 197, 94, 0.15)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                color: '#4ade80',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 13,
              }}
            >
              <Check size={16} />
              {t.registrySuccessTip}
            </div>
          )}

          {errorMsg && (
            <div
              style={{
                marginTop: 14,
                padding: '10px 14px',
                borderRadius: 6,
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 13,
              }}
            >
              <AlertCircle size={16} />
              {errorMsg}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 10,
            padding: '12px 20px',
            borderTop: '1px solid var(--border)',
            background: 'var(--bg-card)',
          }}
        >
          <button className="btn-secondary" onClick={onClose}>
            {t.cancelBtn}
          </button>
          <button
            className="btn-primary-play"
            style={{ padding: '8px 24px', fontSize: 13 }}
            onClick={handleSave}
          >
            {t.saveAndApplyRegistry}
          </button>
        </div>
      </div>
    </div>
  );
};
