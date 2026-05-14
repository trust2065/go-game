import React, { useEffect, useState } from 'react';
import { fetchGamesFromFirebase, updateGameInFirebase } from '../utils/firebase';
import type { GameState } from './GoBoard';
import './GameList.css';

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
    return (
      <div className="game-list-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          載入棋譜中...
        </div>
      </div>
    );
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
    <div className="game-list-container">
      <div className="game-list-header">
        <h3>已儲存的棋譜</h3>
        <button onClick={onNewGame} className="btn-premium btn-accent">
          <span>+</span> 開新棋局
        </button>
      </div>
      
      {games.length === 0 ? (
        <div className="empty-state">目前沒有儲存的棋譜</div>
      ) : (
        <ul className="game-list-ul">
          {games.map(game => (
            <li key={game.id} className="game-list-li">
              {editingId === game.id ? (
                <div className="game-edit-container">
                  <input 
                    type="text" 
                    value={editTitle} 
                    onChange={e => setEditTitle(e.target.value)} 
                    className="game-edit-input"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRenameSubmit(game);
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                  />
                  <button onClick={() => handleRenameSubmit(game)} className="btn-premium btn-black">儲存</button>
                  <button onClick={() => setEditingId(null)} className="btn-premium btn-white">取消</button>
                </div>
              ) : (
                <span className="game-title">{game.title || '未命名棋譜'}</span>
              )}
              
              {editingId !== game.id && (
                <div className="game-list-actions">
                  <button 
                    onClick={() => {
                      setEditingId(game.id);
                      setEditTitle(game.title || '');
                    }} 
                    className="btn-premium btn-white"
                  >
                    改名
                  </button>
                  <button 
                    onClick={() => onSelectGame(game)} 
                    className="btn-premium btn-black"
                  >
                    載入
                  </button>
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
