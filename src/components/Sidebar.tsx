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
      {games.map((game) => {
        const iconUrl =
          game.display?.icon?.url ||
          game.display?.wpf_icon?.url ||
          game.display?.thumbnail?.url ||
          '';
        const isActive = game.id === selectedGameId;

        return (
          <div
            key={game.id}
            className={`game-tab ${isActive ? 'active' : ''}`}
            onClick={() => onSelectGame(game.id)}
            title={game.display?.name}
          >
            {iconUrl ? (
              <img src={iconUrl} alt={game.display?.name} />
            ) : (
              <span>{game.display?.name?.slice(0, 2)}</span>
            )}
          </div>
        );
      })}
    </aside>
  );
};
