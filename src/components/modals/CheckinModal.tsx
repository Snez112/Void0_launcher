import React, { useState } from 'react';
import { Gift, X, CheckCircle2, Clock, Sparkles, HelpCircle } from 'lucide-react';
import { HoyoGame, CheckinStatus } from '../../types';

interface CheckinModalProps {
  currentGame?: HoyoGame;
  checkinStatus: CheckinStatus | null;
  cookie: string;
  autoCheckin: boolean;
  checkinLoading: boolean;
  batchLoading: boolean;
  checkinMessage: string;
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
  onClose,
  onSaveCookie,
  onToggleAutoCheckin,
  onSingleCheckin,
  onBatchCheckin,
}) => {
  const [cookieInput, setCookieInput] = useState<string>(cookie);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Gift size={18} color="#f5b324" />
            <span>Điểm Danh HoYoLAB Tự Động</span>
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
                Tiến độ tháng này ({currentGame?.display?.name}):
              </span>
              <div className="checkin-days">
                {checkinStatus?.total_sign_day ?? 0} <span style={{ fontSize: 14 }}>ngày</span>
              </div>
              <div className="checkin-msg">
                {checkinStatus?.is_sign ? (
                  <span style={{ color: '#4ade80', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <CheckCircle2 size={14} /> Hôm nay đã hoàn tất điểm danh
                  </span>
                ) : (
                  <span style={{ color: 'var(--accent-yellow)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={14} /> Hôm nay chưa điểm danh
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
                <span>{checkinLoading ? 'Đang gửi...' : 'Điểm Danh Game Này'}</span>
              </button>

              <button
                className="btn-secondary"
                onClick={onBatchCheckin}
                disabled={batchLoading || !cookie}
                style={{ justifyContent: 'center' }}
              >
                <span>{batchLoading ? 'Đang điểm danh...' : 'Điểm Danh Tất Cả Game'}</span>
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
            <span>Tự động điểm danh tất cả game mỗi khi mở Launcher</span>
          </label>

          {/* Cookie Setup */}
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>HoYoLAB Cookie:</span>
              <HelpCircle size={14} color="var(--text-dim)" />
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="Dán chuỗi cookie (chứa ltuid_v2, ltoken_v2, ...)"
              value={cookieInput}
              onChange={(e) => setCookieInput(e.target.value)}
            />
          </div>

          {/* Cookie Guide */}
          <div className="cookie-guide">
            <strong>Cách lấy Cookie nhanh (chỉ cần làm 1 lần):</strong>
            <ol style={{ paddingLeft: 18, marginTop: 4 }}>
              <li>Đăng nhập tài khoản tại <code>hoyolab.com</code> trên trình duyệt.</li>
              <li>Nhấn phím <code>F12</code> (hoặc chuột phải chọn Kiểm tra) → chọn tab <code>Console</code>.</li>
              <li>Nhập dòng lệnh: <code>copy(document.cookie)</code> rồi nhấn <code>Enter</code>.</li>
              <li>Quay lại ô trên, dán (Ctrl + V) và nhấn <strong>Lưu Cookie</strong>.</li>
            </ol>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button
              className="btn-primary-play"
              style={{ padding: '8px 24px', fontSize: 13 }}
              onClick={() => {
                onSaveCookie(cookieInput.trim());
                alert('Đã lưu Cookie HoYoLAB thành công!');
              }}
            >
              Lưu Cookie
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
