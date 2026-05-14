import React, { useState } from 'react';
import GoBoard, { type GameState } from './components/GoBoard';
import GameList from './components/GameList';
import './App.css';

function App() {
  const [loadedGameId, setLoadedGameId] = useState<number>(0);
  const [initialHistory, setInitialHistory] = useState<GameState[] | undefined>(undefined);

  const handleSelectGame = (history: GameState[]) => {
    setInitialHistory(history);
    setLoadedGameId(prev => prev + 1); // 改變 key 來強制重新渲染 GoBoard
  };

  const handleNewGame = () => {
    setInitialHistory(undefined);
    setLoadedGameId(prev => prev + 1);
  };

  return (
    <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5', padding: '20px' }}>
      <h1>圍棋排譜工具 (Go Engine)</h1>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={handleNewGame}>開新棋局</button>
      </div>
      <GoBoard key={loadedGameId} size={19} boardSizePx={600} initialHistory={initialHistory} />
      <GameList onSelectGame={handleSelectGame} />
    </div>
  );
}

export default App;
