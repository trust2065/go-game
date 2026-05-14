import React, { useEffect, useState } from 'react';
import { fetchGamesFromFirebase } from '../utils/firebase';
import type { GameState } from './GoBoard';

interface GameRecord {
  id: string;
  title: string;
  history: GameState[];
  createdAt: any;
}

interface GameListProps {
  onSelectGame: (history: GameState[]) => void;
}

const GameList: React.FC<GameListProps> = ({ onSelectGame }) => {
  const [games, setGames] = useState<GameRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGames = async () => {
      try {
        const fetchedGames = await fetchGamesFromFirebase();
        setGames(fetchedGames as GameRecord[]);
      } catch (e) {
        console.error("Failed to load games", e);
      } finally {
        setLoading(false);
      }
    };
    loadGames();
  }, []);

  if (loading) {
    return <div>載入棋譜中...</div>;
  }

  if (games.length === 0) {
    return <div>目前沒有儲存的棋譜</div>;
  }

  return (
    <div style={{ marginTop: '20px', padding: '10px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', width: '600px' }}>
      <h3 style={{ marginTop: 0 }}>已儲存的棋譜</h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {games.map(game => (
          <li key={game.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee' }}>
            <span>{game.title || '未命名棋譜'}</span>
            <button onClick={() => onSelectGame(game.history)}>載入</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GameList;
