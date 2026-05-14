import  { useState } from 'react';
import GoBoard, { type GameState } from './components/GoBoard';
import GameList from './components/GameList';
import './App.css';

function App() {
  const [loadedGameId, setLoadedGameId] = useState<number>(0);
  const [initialHistory, setInitialHistory] = useState<GameState[] | undefined>(undefined);
  const [initialGameId, setInitialGameId] = useState<string | undefined>(undefined);
  const [initialTitle, setInitialTitle] = useState<string | undefined>(undefined);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const handleGameSaved = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleRename = (id: string, newTitle: string) => {
    if (id === initialGameId) {
      setInitialTitle(newTitle);
    }
  };

  const handleSelectGame = (game: any) => {
    setInitialHistory(game.history);
    setInitialGameId(game.id);
    setInitialTitle(game.title);
    setLoadedGameId(prev => prev + 1); // 改變 key 來強制重新渲染 GoBoard
  };

  const handleNewGame = () => {
    setInitialHistory(undefined);
    setInitialGameId(undefined);
    setInitialTitle(undefined);
    setLoadedGameId(prev => prev + 1);
  };

  return (
    <div className="App" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      background: '#e8e2d6', /* 溫暖的底色 */
      backgroundImage: 'radial-gradient(circle at center, #f5f0e6 0%, #e8e2d6 100%)',
      padding: '40px 20px',
      color: '#4a3b2c'
    }}>
      <h1 style={{ 
        margin: '0 0 30px 0', 
        fontSize: '2.5rem', 
        fontWeight: '800', 
        letterSpacing: '2px',
        textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
      }}>
        圍棋排譜工具
      </h1>
      <GoBoard 
        key={loadedGameId} 
        size={19} 
        boardSizePx={600} 
        initialHistory={initialHistory}
        initialGameId={initialGameId}
        initialTitle={initialTitle}
        onGameSaved={handleGameSaved}
      />
      <GameList 
        onSelectGame={handleSelectGame} 
        onNewGame={handleNewGame} 
        onRename={handleRename}
        refreshTrigger={refreshTrigger} 
      />
    </div>
  );
}

export default App;
