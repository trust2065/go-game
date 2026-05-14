import React, { useState } from 'react';
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
    <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5', padding: '20px' }}>
      <h1>圍棋排譜工具</h1>
      <GoBoard 
        key={loadedGameId} 
        size={19} 
        boardSizePx={600} 
        initialHistory={initialHistory}
        initialGameId={initialGameId}
        initialTitle={initialTitle}
        onGameSaved={handleGameSaved}
      />
      <GameList onSelectGame={handleSelectGame} onNewGame={handleNewGame} refreshTrigger={refreshTrigger} />
    </div>
  );
}

export default App;
