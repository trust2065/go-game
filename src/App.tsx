import React from 'react';
import GoBoard from './components/GoBoard';
import './App.css';

function App() {
  return (
    <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' }}>
      <h1>圍棋排譜工具 (Go Engine)</h1>
      <GoBoard size={19} boardSizePx={600} />
    </div>
  );
}

export default App;
