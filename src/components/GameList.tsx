import React, { useEffect, useState } from 'react';
import { fetchGamesFromFirebase, updateGameInFirebase } from '../utils/firebase';
import type { GameState } from './GoBoard';

interface GameRecord {
  id: string;
  title: string;
  history: GameState[];
  createdAt: any;
}

interface GameListProps {
  onSelectGame: (game: GameRecord) => void;
  onNewGame: () => void;
  onRename?: (id: string, newTitle: string) => void;
  refreshTrigger?: number;
}

const GameList: React.FC<GameListProps> = ({ onSelectGame, onNewGame, onRename, refreshTrigger }) => {
  const [games, setGames] = useState<GameRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

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
  }, [refreshTrigger]);

  if (loading) {
    return <div>載入棋譜中...</div>;
  }

  const handleRenameSubmit = async (game: GameRecord) => {
    if (!editTitle.trim()) {
      setEditingId(null);
      return;
    }
    try {
      await updateGameInFirebase(game.id, editTitle, game.history);
      setGames(prev => prev.map(g => g.id === game.id ? { ...g, title: editTitle } : g));
      onRename?.(game.id, editTitle);
      setEditingId(null);
    } catch (error) {
      console.error("Rename failed", error);
      alert("改名失敗");
    }
  };

  return (
    <div style={{ marginTop: '20px', padding: '10px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', width: '600px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h3 style={{ margin: 0 }}>已儲存的棋譜</h3>
        <button onClick={onNewGame} style={{ padding: '5px 10px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          開新棋局
        </button>
      </div>
      
      {games.length === 0 ? (
        <div>目前沒有儲存的棋譜</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {games.map(game => (
            <li key={game.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #eee' }}>
              {editingId === game.id ? (
                <div style={{ display: 'flex', gap: '5px', flex: 1, marginRight: '10px' }}>
                  <input 
                    type="text" 
                    value={editTitle} 
                    onChange={e => setEditTitle(e.target.value)} 
                    style={{ flex: 1, padding: '5px' }}
                    autoFocus
                  />
                  <button onClick={() => handleRenameSubmit(game)}>儲存</button>
                  <button onClick={() => setEditingId(null)}>取消</button>
                </div>
              ) : (
                <span style={{ flex: 1 }}>{game.title || '未命名棋譜'}</span>
              )}
              
              {editingId !== game.id && (
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button onClick={() => {
                    setEditingId(game.id);
                    setEditTitle(game.title || '');
                  }}>改名</button>
                  <button onClick={() => onSelectGame(game)}>載入</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GameList;
