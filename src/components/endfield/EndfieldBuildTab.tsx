import React, { useState, useMemo } from 'react';
import {
  Search,
  ExternalLink,
  Shield,
  Zap,
  Flame,
  Snowflake,
  Leaf,
  Sparkles,
  Award,
  Layers,
  Activity,
  BookOpen,
  Wrench,
  ChevronRight,
  ArrowLeft,
  RefreshCw,
} from 'lucide-react';
import { ENDFIELD_OPERATOR_BUILDS } from '../../data/endfieldBuilds';
import './EndfieldBuildTab.css';

interface EndfieldBuildTabProps {
  onBackToOverview?: () => void;
}

export const EndfieldBuildTab: React.FC<EndfieldBuildTabProps> = ({ onBackToOverview }) => {
  const [selectedOpId, setSelectedOpId] = useState<string>(ENDFIELD_OPERATOR_BUILDS[0].id);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedElement, setSelectedElement] = useState<string>('All');
  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [activeBranchIdx, setActiveBranchIdx] = useState<number>(0);

  // Filter operators
  const filteredOperators = useMemo(() => {
    return ENDFIELD_OPERATOR_BUILDS.filter((op) => {
      const matchSearch =
        op.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        op.codeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        op.chineseName.includes(searchQuery) ||
        op.roleVi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        op.elementVi.toLowerCase().includes(searchQuery.toLowerCase());

      const matchElement = selectedElement === 'All' || op.element === selectedElement;
      const matchRole = selectedRole === 'All' || op.role === selectedRole;

      return matchSearch && matchElement && matchRole;
    });
  }, [searchQuery, selectedElement, selectedRole]);

  const activeOp = useMemo(() => {
    return (
      ENDFIELD_OPERATOR_BUILDS.find((op) => op.id === selectedOpId) ||
      filteredOperators[0] ||
      ENDFIELD_OPERATOR_BUILDS[0]
    );
  }, [selectedOpId, filteredOperators]);

  const getElementIcon = (element: string) => {
    switch (element) {
      case 'Nature':
        return <Leaf size={13} color="#22c55e" />;
      case 'Cryo':
        return <Snowflake size={13} color="#38bdf8" />;
      case 'Heat':
        return <Flame size={13} color="#ef4444" />;
      case 'Electric':
        return <Zap size={13} color="#eab308" />;
      default:
        return <Shield size={13} color="#94a3b8" />;
    }
  };

  return (
    <div className="a9e-build-hub">
      {/* Top Header Bar */}
      <header className="a9e-build-topbar">
        <div className="a9e-topbar-left">
          <div className="a9e-protocol-tag">
            <span className="a9e-dot" />
            <span>TALOS-II ARCHIVE // PROTOCOL v1.6</span>
          </div>
          <div className="a9e-title-row">
            <h2 className="a9e-topbar-title">HƯỚNG DẪN BUILD META</h2>
            <span className="a9e-title-count">({ENDFIELD_OPERATOR_BUILDS.length} OPERATORS)</span>
          </div>
        </div>

        {/* Global Meta Sources */}
        <div className="a9e-sources-pill-box">
          <span className="a9e-sources-label">NGUỒN DỮ LIỆU:</span>
          <div className="a9e-sources-links">
            <a
              href="https://www.prydwen.gg/arknights-endfield/"
              target="_blank"
              rel="noreferrer"
              className="a9e-source-btn prydwen"
              title="Prydwen Institute: Rotation, SP calculations & Tier List"
            >
              <span>Prydwen.gg</span>
              <ExternalLink size={10} />
            </a>
            <a
              href="https://mobalytics.gg/arknights-endfield"
              target="_blank"
              rel="noreferrer"
              className="a9e-source-btn mobalytics"
              title="Mobalytics: Build Infographics"
            >
              <span>Mobalytics</span>
              <ExternalLink size={10} />
            </a>
            <a
              href="https://www.icy-veins.com/arknights-endfield/"
              target="_blank"
              rel="noreferrer"
              className="a9e-source-btn icyveins"
              title="Icy Veins: In-depth Reviews"
            >
              <span>Icy Veins</span>
              <ExternalLink size={10} />
            </a>
            <a
              href="https://arknightsendfield.gg/"
              target="_blank"
              rel="noreferrer"
              className="a9e-source-btn a9egg"
              title="Endfield.GG: AIC Factory Blueprints & CC Ratings"
            >
              <span>Endfield.GG</span>
              <ExternalLink size={10} />
            </a>
            <a
              href="https://wiki.biligame.com/zmd"
              target="_blank"
              rel="noreferrer"
              className="a9e-source-btn bwiki"
              title="BWIKI & Skland: Official CN Data & Frame Multipliers"
            >
              <span>BWIKI (CN)</span>
              <ExternalLink size={10} />
            </a>
          </div>
        </div>

        {/* Navigation Action */}
        <div className="a9e-topbar-actions">
          {onBackToOverview && (
            <button
              type="button"
              className="a9e-topbar-switch-btn"
              onClick={onBackToOverview}
              title="Quay lại Launcher & Tin tức sự kiện"
            >
              <ArrowLeft size={13} />
              <span>VỀ TRANG CHỦ</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Workspace Body */}
      <div className="a9e-build-body">
        {/* Left Column: Filters + Operator List */}
        <aside className="a9e-op-sidebar">
          {/* Search Box */}
          <div className="a9e-search-box">
            <Search size={13} className="a9e-search-icon" />
            <input
              type="text"
              className="a9e-search-input"
              placeholder="Tìm Operator (Si, Angelina, Ember...)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="a9e-clear-search-btn"
                onClick={() => setSearchQuery('')}
              >
                ×
              </button>
            )}
          </div>

          {/* Element Filter Pills */}
          <div className="a9e-filter-group">
            <span className="a9e-filter-title">HỆ NGUYÊN TỐ:</span>
            <div className="a9e-filter-row">
              {['All', 'Nature', 'Cryo', 'Heat', 'Electric', 'Physical'].map((elem) => (
                <button
                  key={elem}
                  type="button"
                  className={`a9e-filter-pill ${selectedElement === elem ? 'active' : ''}`}
                  onClick={() => setSelectedElement(elem)}
                >
                  {elem === 'All' ? 'Tất cả' : elem}
                </button>
              ))}
            </div>
          </div>

          {/* Role Filter Pills */}
          <div className="a9e-filter-group">
            <span className="a9e-filter-title">VAI TRÒ TÁC CHIẾN:</span>
            <div className="a9e-filter-row">
              {['All', 'Guard', 'Striker', 'Caster', 'Supporter', 'Vanguard', 'Defender'].map(
                (role) => (
                  <button
                    key={role}
                    type="button"
                    className={`a9e-filter-pill ${selectedRole === role ? 'active' : ''}`}
                    onClick={() => setSelectedRole(role)}
                  >
                    {role === 'All' ? 'Tất cả' : role}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Operator Badges List (Scrollable) */}
          <div className="a9e-op-list">
            {filteredOperators.length === 0 ? (
              <div className="a9e-empty-list">
                <p>Không tìm thấy Operator phù hợp</p>
                <button
                  type="button"
                  className="a9e-reset-filter-btn"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedElement('All');
                    setSelectedRole('All');
                  }}
                >
                  <RefreshCw size={12} />
                  <span>Đặt lại bộ lọc</span>
                </button>
              </div>
            ) : (
              filteredOperators.map((op) => {
                const isSelected = op.id === activeOp.id;
                return (
                  <div
                    key={op.id}
                    className={`a9e-op-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedOpId(op.id);
                      setActiveBranchIdx(0);
                    }}
                  >
                    <div className="a9e-op-avatar-wrap">
                      <img
                        src={op.avatar}
                        alt={op.name}
                        className="a9e-op-avatar"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.src.endsWith('/avatars/endfield/perlica.webp')) {
                            target.src = '/avatars/endfield/perlica.webp';
                          }
                        }}
                      />
                      <div className="a9e-op-elem-icon">{getElementIcon(op.element)}</div>
                    </div>

                    <div className="a9e-op-meta">
                      <div className="a9e-op-name-row">
                        <span className="a9e-op-name">{op.name}</span>
                        {op.isNew16 && <span className="a9e-badge-new">v1.6 MỚI</span>}
                      </div>
                      <div className="a9e-op-sub-row">
                        <span className="a9e-op-stars">{'★'.repeat(op.rarity)}</span>
                        <span className="a9e-op-role">{op.roleVi.split(' ')[0]}</span>
                        <span className={`a9e-op-tier-tag tier-${op.tier.toLowerCase().replace('+', 'p')}`}>
                          {op.tier}
                        </span>
                      </div>
                    </div>

                    <ChevronRight size={13} className="a9e-op-arrow" />
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* Right Area: Comprehensive Operator Dossier (Scrollable) */}
        <section className="a9e-dossier-area">
          {/* Header Card (Clean Vertical Stack: Info top, Scores bottom) */}
          <div className="a9e-dossier-header-card">
            <div className="a9e-dossier-header-top">
              <div className="a9e-dossier-tags">
                <span className="a9e-tag-code">{activeOp.codeName}</span>
                <span className="a9e-tag-chinese">{activeOp.chineseName}</span>
                <span
                  className="a9e-tag-elem"
                  style={{
                    borderColor: activeOp.elementColor,
                    color: activeOp.elementColor,
                    backgroundColor: `${activeOp.elementColor}15`,
                  }}
                >
                  {getElementIcon(activeOp.element)}
                  <span>{activeOp.elementVi}</span>
                </span>
                <span className="a9e-tag-role">{activeOp.roleVi}</span>
                <span className="a9e-tag-rarity">{'★'.repeat(activeOp.rarity)} ĐẲNG CẤP</span>
                <span className={`a9e-tag-tier tier-${activeOp.tier.toLowerCase().replace('+', 'p')}`}>
                  TIER {activeOp.tier}
                </span>
              </div>

              <h1 className="a9e-dossier-title">{activeOp.name}</h1>
              <p className="a9e-dossier-summary">{activeOp.summary}</p>
            </div>

            {/* Radar Scores Grid Across Full Width */}
            <div className="a9e-scores-grid">
              <div className="a9e-score-item">
                <span className="a9e-score-num">{activeOp.ratings.singleTarget.toFixed(1)}</span>
                <span className="a9e-score-name">Đơn Mục Tiêu (ST)</span>
              </div>
              <div className="a9e-score-item">
                <span className="a9e-score-num">{activeOp.ratings.aoe.toFixed(1)}</span>
                <span className="a9e-score-name">Đa Mục Tiêu (AoE)</span>
              </div>
              <div className="a9e-score-item">
                <span className="a9e-score-num">{activeOp.ratings.support.toFixed(1)}</span>
                <span className="a9e-score-name">Hỗ Trợ / Sinh Tồn</span>
              </div>
              <div className="a9e-score-item">
                <span className="a9e-score-num">{activeOp.ratings.synergy.toFixed(1)}</span>
                <span className="a9e-score-name">Độ Hợp Chuỗi (Synergy)</span>
              </div>
              <div className="a9e-score-item highlight">
                <span className="a9e-score-num gold">
                  {activeOp.ratings.contingencyContract.toFixed(1)}
                </span>
                <span className="a9e-score-name">Thử Thách Khó (CC)</span>
              </div>
            </div>
          </div>

          {/* Hybrid Branch Selector (e.g., Arcane) */}
          {activeOp.branches && activeOp.branches.length > 0 && (
            <div className="a9e-branch-selector-card">
              <div className="a9e-branch-header">
                <BookOpen size={14} color="#f59e0b" />
                <span>PHÂN NHÁNH LỐI CHƠI ĐẶC THÙ (THEORYCRAFTING HYBRID)</span>
              </div>
              <div className="a9e-branch-tabs">
                {activeOp.branches.map((b, idx) => (
                  <button
                    key={b.name}
                    type="button"
                    className={`a9e-branch-btn ${activeBranchIdx === idx ? 'active' : ''}`}
                    onClick={() => setActiveBranchIdx(idx)}
                  >
                    <span>{b.name}</span>
                  </button>
                ))}
              </div>
              <div className="a9e-branch-desc-box">
                <p className="a9e-branch-desc">{activeOp.branches[activeBranchIdx].description}</p>
                <div className="a9e-branch-meta">
                  <span className="a9e-branch-focus">
                    <b>Chỉ số nòng cốt:</b> {activeOp.branches[activeBranchIdx].statFocus}
                  </span>
                  <span className="a9e-branch-gear">
                    <b>Trang bị tương thích:</b> {activeOp.branches[activeBranchIdx].gearRecommendation}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Detailed Content Columns: Responsive Grid */}
          <div className="a9e-dossier-grid">
            {/* Column 1: Weapons & Gear */}
            <div className="a9e-grid-col">
              {/* Weapons Priority Card */}
              <div className="a9e-card">
                <div className="a9e-card-header">
                  <Wrench size={15} color="var(--a9e-yellow-bright)" />
                  <span className="a9e-card-title">VŨ KHÍ KHUYÊN DÙNG (WEAPON HIERARCHY)</span>
                </div>

                {/* Signature Weapon */}
                <div className="a9e-weapon-entry signature">
                  <div className="a9e-weapon-header">
                    <span className="a9e-weapon-badge sig">TRẤN BI-S</span>
                    <h4 className="a9e-weapon-name">{activeOp.weapons.signature.name}</h4>
                    <span className="a9e-weapon-stars">
                      {'★'.repeat(activeOp.weapons.signature.rarity)}
                    </span>
                  </div>
                  <p className="a9e-weapon-effect">{activeOp.weapons.signature.effect}</p>
                  <div className="a9e-weapon-note">
                    <b>Đánh giá:</b> {activeOp.weapons.signature.tierNote}
                  </div>
                </div>

                {/* Alternative Weapons */}
                <div className="a9e-weapon-sub-title">LỰA CHỌN THAY THẾ (F2P / CHẾ TẠO AIC):</div>
                <div className="a9e-alt-weapons-list">
                  {activeOp.weapons.alternatives.map((alt) => (
                    <div key={alt.name} className="a9e-weapon-entry alt">
                      <div className="a9e-weapon-header">
                        <span className="a9e-weapon-badge alt">THAY THẾ</span>
                        <h5 className="a9e-weapon-name">{alt.name}</h5>
                        <span className="a9e-weapon-perf">{alt.performance}</span>
                      </div>
                      <p className="a9e-weapon-effect">{alt.effect}</p>
                      <div className="a9e-weapon-source">Nguồn: {alt.source}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gear Sets & AIC Factory Blueprint */}
              <div className="a9e-card">
                <div className="a9e-card-header">
                  <Layers size={15} color="#38bdf8" />
                  <span className="a9e-card-title">BỘ TRANG BỊ & DÂY CHUYỀN AIC</span>
                </div>

                <div className="a9e-gear-box best">
                  <div className="a9e-gear-title-row">
                    <span className="a9e-gear-badge">TỐI ƯU NHẤT</span>
                    <h4 className="a9e-gear-name">{activeOp.gear.bestSet.name}</h4>
                    <span className="a9e-gear-pieces">{activeOp.gear.bestSet.pieces}</span>
                  </div>
                  <p className="a9e-gear-bonus">{activeOp.gear.bestSet.bonus}</p>
                  <div className="a9e-gear-aic">
                    <span className="a9e-aic-icon">🏭</span>
                    <span className="a9e-aic-text">
                      <b>Sơ đồ Nhà Máy AIC:</b> {activeOp.gear.bestSet.aicBlueprint}
                    </span>
                  </div>
                </div>

                {activeOp.gear.alternativeSet && (
                  <div className="a9e-gear-box alt">
                    <div className="a9e-gear-title-row">
                      <span className="a9e-gear-badge secondary">TÙY CHỌN 2+2</span>
                      <h4 className="a9e-gear-name">{activeOp.gear.alternativeSet.name}</h4>
                      <span className="a9e-gear-pieces">{activeOp.gear.alternativeSet.pieces}</span>
                    </div>
                    <p className="a9e-gear-bonus">{activeOp.gear.alternativeSet.bonus}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Column 2: Stats, Skills & Combo Mechanics */}
            <div className="a9e-grid-col">
              {/* Stat Priorities & Benchmarks */}
              <div className="a9e-card">
                <div className="a9e-card-header">
                  <Activity size={15} color="#4ade80" />
                  <span className="a9e-card-title">CHỈ SỐ ƯU TIÊN & NGƯỠNG ĐẠT (STATS)</span>
                </div>

                <div className="a9e-stat-block">
                  <span className="a9e-stat-label">CHỈ SỐ CHÍNH (MAIN STATS):</span>
                  <div className="a9e-stat-tags">
                    {activeOp.stats.mainStats.map((st, i) => (
                      <span key={st} className="a9e-stat-tag main">
                        <span className="a9e-stat-rank">{i + 1}</span>
                        {st}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="a9e-stat-block">
                  <span className="a9e-stat-label">DÒNG PHỤ (SUB-STATS):</span>
                  <div className="a9e-substat-box">{activeOp.stats.subStats.join(' // ')}</div>
                </div>

                <div className="a9e-benchmarks-box">
                  <span className="a9e-stat-label">CHỈ SỐ TIÊU CHUẨN ENDGAME (BENCHMARKS):</span>
                  <div className="a9e-benchmarks-grid">
                    {activeOp.stats.benchmarks.map((bm) => (
                      <div key={bm.label} className="a9e-bm-item">
                        <span className="a9e-bm-name">{bm.label}</span>
                        <span className="a9e-bm-target">{bm.target}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Skill & Mastery Priority */}
              <div className="a9e-card">
                <div className="a9e-card-header">
                  <Sparkles size={15} color="#ec4899" />
                  <span className="a9e-card-title">THỨ TỰ KỸ NĂNG & MASTERY</span>
                </div>

                <div className="a9e-skill-chain">
                  {activeOp.skills.priority.map((sk) => (
                    <div key={sk} className="a9e-skill-step">
                      <span className="a9e-step-text">{sk}</span>
                    </div>
                  ))}
                </div>

                <div className="a9e-mastery-note">
                  <b>Mốc Đột Phá Mastery:</b> {activeOp.skills.masteryNotes}
                </div>
              </div>

              {/* Combo Skill & Elemental Reaction */}
              <div className="a9e-card highlight-border">
                <div className="a9e-card-header">
                  <Zap size={15} color="var(--a9e-yellow-bright)" />
                  <span className="a9e-card-title">CƠ CHẾ COMBO & PHẢN ỨNG NGUYÊN TỐ</span>
                </div>

                <div className="a9e-combo-section">
                  <div className="a9e-combo-row">
                    <span className="a9e-combo-tag trigger">ĐIỀU KIỆN KÍCH HOẠT:</span>
                    <p className="a9e-combo-val">{activeOp.comboMechanics.triggerCondition}</p>
                  </div>
                  <div className="a9e-combo-row">
                    <span className="a9e-combo-tag effect">HIỆU ỨNG GÂY RA:</span>
                    <p className="a9e-combo-val">{activeOp.comboMechanics.appliedEffect}</p>
                  </div>
                  <div className="a9e-combo-row rotation">
                    <span className="a9e-combo-tag rotate">VÒNG LẶP XOAY TUA:</span>
                    <p className="a9e-combo-val highlight">{activeOp.comboMechanics.rotationTip}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Squads */}
          <div className="a9e-card full-width">
            <div className="a9e-card-header">
              <Award size={15} color="var(--a9e-yellow-bright)" />
              <span className="a9e-card-title">ĐỘI HÌNH META KHUYÊN DÙNG (RECOMMENDED SQUADS)</span>
            </div>

            <div className="a9e-teams-container">
              {activeOp.bestTeams.map((team) => (
                <div key={team.name} className="a9e-team-card">
                  <div className="a9e-team-title-row">
                    <h4 className="a9e-team-name">{team.name}</h4>
                    <span className="a9e-team-badge">TỐI ƯU 1.6</span>
                  </div>
                  <p className="a9e-team-desc">{team.description}</p>

                  <div className="a9e-team-slots">
                    {team.operators.map((member, idx) => (
                      <div key={member.name} className="a9e-team-member">
                        <span className="a9e-member-idx">SLOT {idx + 1}</span>
                        <div className="a9e-member-name-row">
                          <span className="a9e-member-name">{member.name}</span>
                          <span className="a9e-member-elem">({member.element})</span>
                        </div>
                        <span className="a9e-member-role">{member.roleInTeam}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* External Links Bar */}
          <div className="a9e-external-links-bar">
            <span className="a9e-ext-label">TRA CỨU {activeOp.name} TRÊN TRANG NGOẠI TUYẾN:</span>
            <div className="a9e-ext-btns">
              {activeOp.externalLinks.prydwenUrl && (
                <a
                  href={activeOp.externalLinks.prydwenUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="a9e-ext-link-btn"
                >
                  <span>Prydwen Detailed Guide</span>
                  <ExternalLink size={11} />
                </a>
              )}
              {activeOp.externalLinks.mobalyticsUrl && (
                <a
                  href={activeOp.externalLinks.mobalyticsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="a9e-ext-link-btn"
                >
                  <span>Mobalytics Build Sheet</span>
                  <ExternalLink size={11} />
                </a>
              )}
              {activeOp.externalLinks.icyVeinsUrl && (
                <a
                  href={activeOp.externalLinks.icyVeinsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="a9e-ext-link-btn"
                >
                  <span>Icy Veins v1.6 Review</span>
                  <ExternalLink size={11} />
                </a>
              )}
              {activeOp.externalLinks.endfieldGgUrl && (
                <a
                  href={activeOp.externalLinks.endfieldGgUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="a9e-ext-link-btn"
                >
                  <span>Endfield.GG Blueprint Hub</span>
                  <ExternalLink size={11} />
                </a>
              )}
              {activeOp.externalLinks.bwikiUrl && (
                <a
                  href={activeOp.externalLinks.bwikiUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="a9e-ext-link-btn"
                >
                  <span>BWIKI / Skland (CN)</span>
                  <ExternalLink size={11} />
                </a>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
