import React, { useState } from 'react';
import { HoyoBanner, HoyoPost } from '../types';

interface DashboardProps {
  banners: HoyoBanner[];
  posts: HoyoPost[];
  activeBannerIdx: number;
  onSelectBannerIdx: (idx: number) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  banners,
  posts,
  activeBannerIdx,
  onSelectBannerIdx,
}) => {
  const [activeNewsTab, setActiveNewsTab] = useState<string>('ALL');

  const filteredPosts = posts.filter((post) => {
    if (activeNewsTab === 'ALL') return true;
    if (activeNewsTab === 'ANNOUNCE') return post.type === 'POST_TYPE_ANNOUNCE';
    if (activeNewsTab === 'ACTIVITY') return post.type === 'POST_TYPE_ACTIVITY';
    if (activeNewsTab === 'INFO') return post.type === 'POST_TYPE_INFO';
    return true;
  });

  return (
    <div className="dashboard-grid">
      {/* Banner Carousel */}
      {banners.length > 0 && (
        <div
          className="banner-card"
          onClick={() => {
            const b = banners[activeBannerIdx];
            if (b?.image?.link) window.open(b.image.link, '_blank');
          }}
        >
          <img src={banners[activeBannerIdx]?.image?.url} alt="Banner" />
          <div className="banner-dots">
            {banners.map((_, idx) => (
              <span
                key={idx}
                className={`dot ${idx === activeBannerIdx ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectBannerIdx(idx);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* News Feed */}
      <div className="news-card">
        <div className="news-tabs">
          <button
            className={`news-tab-btn ${activeNewsTab === 'ALL' ? 'active' : ''}`}
            onClick={() => setActiveNewsTab('ALL')}
          >
            Tất cả
          </button>
          <button
            className={`news-tab-btn ${activeNewsTab === 'ANNOUNCE' ? 'active' : ''}`}
            onClick={() => setActiveNewsTab('ANNOUNCE')}
          >
            Thông báo
          </button>
          <button
            className={`news-tab-btn ${activeNewsTab === 'ACTIVITY' ? 'active' : ''}`}
            onClick={() => setActiveNewsTab('ACTIVITY')}
          >
            Sự kiện
          </button>
          <button
            className={`news-tab-btn ${activeNewsTab === 'INFO' ? 'active' : ''}`}
            onClick={() => setActiveNewsTab('INFO')}
          >
            Tin tức
          </button>
        </div>

        <div className="news-items">
          {filteredPosts.slice(0, 5).map((post) => (
            <a
              key={post.id}
              href={post.link}
              target="_blank"
              rel="noreferrer"
              className="news-item"
            >
              <span className="news-item-badge">
                {post.type === 'POST_TYPE_ANNOUNCE'
                  ? 'Thông báo'
                  : post.type === 'POST_TYPE_ACTIVITY'
                  ? 'Sự kiện'
                  : 'Tin'}
              </span>
              <span className="news-item-title" title={post.title}>
                {post.title}
              </span>
              <span className="news-item-date">{post.date}</span>
            </a>
          ))}
          {filteredPosts.length === 0 && (
            <div style={{ color: 'var(--text-dim)', fontSize: 13, padding: '10px 0' }}>
              Không có tin tức nào trong mục này.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
