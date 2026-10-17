import React from 'react';
import { HoyoGame } from '../types';

interface SidebarProps {
  games: HoyoGame[];
  selectedGameId: string;
  onSelectGame: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  games,
  selectedGameId,
  onSelectGame,
}) => {
  return (
    <aside className="sidebar">
      {games.map((game, idx) => {
        const iconUrl =
          game.display?.icon?.url ||
          game.display?.wpf_icon?.url ||
          game.display?.thumbnail?.url ||
          '';
        const isActive = game.id === selectedGameId;
        const isEndfield = game.id.includes('endfield');
        const prevGame = games[idx - 1];
        const isFirstEndfield = isEndfield && prevGame && !prevGame.id.includes('endfield');

        return (
          <React.Fragment key={game.id}>
            {isFirstEndfield && <div className="sidebar-divider" title="Gryphline / Hypergryph" />}
            <div
              className={`game-tab ${isActive ? 'active' : ''} ${isEndfield ? 'endfield-tab' : ''}`}
              onClick={() => onSelectGame(game.id)}
              title={game.display?.name}
            >
              {iconUrl ? (
                <img src={iconUrl} alt={game.display?.name} />
              ) : (
                <span>{game.display?.name?.slice(0, 2)}</span>
              )}
              {isEndfield && <span className="endfield-map-badge">MAP</span>}
            </div>
          </React.Fragment>
        );
      })}
    </aside>
  );
};
