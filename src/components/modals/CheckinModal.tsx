import React, { useState } from 'react';
import { Gift, X, CheckCircle2, Clock, Sparkles, HelpCircle } from 'lucide-react';
import { HoyoGame, CheckinStatus } from '../../types';
import { getT } from '../../i18n/translations';

interface CheckinModalProps {
  currentGame?: HoyoGame;
  checkinStatus: CheckinStatus | null;
  cookie: string;
  autoCheckin: boolean;
  checkinLoading: boolean;
  batchLoading: boolean;
  checkinMessage: string;
  language: string;
  onClose: () => void;
  onSaveCookie: (cookie: string) => void;
  onToggleAutoCheckin: (enabled: boolean) => void;
  onSingleCheckin: () => void;
  onBatchCheckin: () => void;
}

export const CheckinModal: React.FC<CheckinModalProps> = ({
  currentGame,
  checkinStatus,
  cookie,
  autoCheckin,
  checkinLoading,
  batchLoading,
  checkinMessage,
  language,
  onClose,
  onSaveCookie,
  onToggleAutoCheckin,
  onSingleCheckin,
  onBatchCheckin,
}) => {
  const t = getT(language);
  const [cookieInput, setCookieInput] = useState<string>(cookie);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Gift size={18} color="#f5b324" />
            <span>{t.checkinModalTitle}</span>
          </div>
          <button className="win-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          {/* Status Hero */}
          <div className="checkin-hero">
            <div className="checkin-stats">
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                {t.monthlyProgress.replace('{game}', currentGame?.display?.name || '')}:
              </span>
              <div className="checkin-days">
                {checkinStatus?.total_sign_day ?? 0} <span style={{ fontSize: 14 }}>{t.daysUnit}</span>
              </div>
              <div className="checkin-msg">
                {checkinStatus?.is_sign ? (
                  <span style={{ color: '#4ade80', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <CheckCircle2 size={14} /> {t.alreadyCheckedIn}
                  </span>
                ) : (
                  <span style={{ color: 'var(--accent-yellow)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={14} /> {t.notCheckedInYet}
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button
                className="btn-primary-play"
                style={{ padding: '10px 20px', fontSize: 13 }}
                onClick={onSingleCheckin}
                disabled={checkinLoading || !cookie}
              >
                <Sparkles size={16} />
                <span>{checkinLoading ? t.checkinSending : t.checkinThisGame}</span>
              </button>

              <button
                className="btn-secondary"
                onClick={onBatchCheckin}
                disabled={batchLoading || !cookie}
                style={{ justifyContent: 'center' }}
              >
                <span>{batchLoading ? t.checkinSending : t.checkinAllGames}</span>
              </button>
            </div>
          </div>

          {checkinMessage && (
            <div
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                background: 'rgba(245, 179, 36, 0.15)',
                border: '1px solid rgba(245, 179, 36, 0.3)',
                fontSize: 13,
                color: 'var(--text-main)',
              }}
            >
              {checkinMessage}
            </div>
          )}

          {/* Auto Check-in Toggle */}
          <label className="toggle-label">
            <input
              type="checkbox"
              className="toggle-checkbox"
              checked={autoCheckin}
              onChange={(e) => onToggleAutoCheckin(e.target.checked)}
            />
            <span>{t.autoCheckinLabel}</span>
          </label>

          {/* Cookie Setup */}
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>{t.hoyolabCookieLabel}:</span>
              <HelpCircle size={14} color="var(--text-dim)" />
            </label>
            <input
              type="text"
              className="form-input"
              placeholder={t.cookiePlaceholder}
              value={cookieInput}
              onChange={(e) => setCookieInput(e.target.value)}
            />
          </div>

          {/* Cookie Guide */}
          <div className="cookie-guide">
            <strong>{t.cookieGuideTitle}</strong>
            <ol style={{ paddingLeft: 18, marginTop: 4 }}>
              <li>{t.cookieGuideStep1}</li>
              <li>{t.cookieGuideStep2}</li>
              <li>{t.cookieGuideStep3}</li>
              <li>{t.cookieGuideStep4}</li>
            </ol>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button
              className="btn-primary-play"
              style={{ padding: '8px 24px', fontSize: 13 }}
              onClick={() => {
                onSaveCookie(cookieInput.trim());
                alert(t.cookieSavedAlert);
              }}
            >
              {t.saveCookieBtn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
