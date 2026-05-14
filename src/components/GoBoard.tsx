import React, { useRef, useEffect, useState } from 'react';
import { applyMove, type Cell, type Player } from '../utils/goLogic';
import './GoBoard.css';
import { saveGameToFirebase } from '../utils/firebase';

interface GoBoardProps {
  size?: number;
  boardSizePx?: number;
  initialHistory?: GameState[];
}

export interface GameState {
  board: Cell[][];
  currentPlayer: Player;
  blackCaptures: number; // 黑子提掉的白子數
  whiteCaptures: number; // 白子提掉的黑子數
}

const GoBoard: React.FC<GoBoardProps> = ({ size = 19, boardSizePx = 600, initialHistory }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // 使用統一的 history 陣列來管理所有狀態，方便實作 Undo / Redo
  const [history, setHistory] = useState<GameState[]>(initialHistory || [{
    board: Array(size).fill(null).map(() => Array(size).fill(0)),
    currentPlayer: 1,
    blackCaptures: 0,
    whiteCaptures: 0,
  }]);
  const [title, setTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [step, setStep] = useState<number>(initialHistory ? initialHistory.length - 1 : 0);
  const [warning, setWarning] = useState<string>('');

  const currentState = history[step];
  const { board, currentPlayer, blackCaptures, whiteCaptures } = currentState;

  const padding = 30;
  const gridWidth = boardSizePx - padding * 2;
  const cellSize = gridWidth / (size - 1);

  // 繪製棋盤與棋子
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, boardSizePx, boardSizePx);

    // 網格線
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.lineWidth = 1;
    for (let i = 0; i < size; i++) {
      const pos = padding + i * cellSize;
      ctx.moveTo(pos, padding);
      ctx.lineTo(pos, boardSizePx - padding);
      ctx.moveTo(padding, pos);
      ctx.lineTo(boardSizePx - padding, pos);
    }
    ctx.stroke();

    // 星位
    const starPoints = size === 19 ? [3, 9, 15] : (size === 13 ? [3, 6, 9] : (size === 9 ? [2, 4, 6] : []));
    ctx.fillStyle = '#000';
    for (const r of starPoints) {
      for (const c of starPoints) {
        ctx.beginPath();
        ctx.arc(padding + c * cellSize, padding + r * cellSize, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 棋子
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const cell = board[r][c];
        if (cell === 0) continue;

        const x = padding + c * cellSize;
        const y = padding + r * cellSize;
        const radius = cellSize * 0.48;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);

        if (cell === 1) {
          const gradient = ctx.createRadialGradient(x - radius * 0.3, y - radius * 0.3, radius * 0.1, x, y, radius);
          gradient.addColorStop(0, '#555');
          gradient.addColorStop(1, '#000');
          ctx.fillStyle = gradient;
          
          ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
          ctx.shadowBlur = 4;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
        } else {
          const gradient = ctx.createRadialGradient(x - radius * 0.3, y - radius * 0.3, radius * 0.1, x, y, radius);
          gradient.addColorStop(0, '#fff');
          gradient.addColorStop(1, '#ddd');
          ctx.fillStyle = gradient;
          
          ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
          ctx.shadowBlur = 4;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
        }

        ctx.fill();
        ctx.shadowColor = 'transparent';
      }
    }
  }, [board, size, boardSizePx, cellSize]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const col = Math.round((x - padding) / cellSize);
    const row = Math.round((y - padding) / cellSize);

    if (col < 0 || col >= size || row < 0 || row >= size) return;
    if (board[row][col] !== 0) return;

    // 計算落子邏輯
    const { newBoard, capturedStones, isSuicide } = applyMove(board, row, col, currentPlayer);

    if (isSuicide) {
      console.warn(`[禁著點] 玩家 ${currentPlayer} 下在無氣的位置`);
      setWarning('⚠️ 禁著點 (無氣)！為方便覆盤仍允許落子');
      setTimeout(() => setWarning(''), 3000);
    } else {
      setWarning('');
    }

    // 計算新的提子數
    const newBlackCaptures = blackCaptures + (currentPlayer === 1 ? capturedStones.length : 0);
    const newWhiteCaptures = whiteCaptures + (currentPlayer === 2 ? capturedStones.length : 0);

    // 建立新狀態
    const nextState: GameState = {
      board: newBoard,
      currentPlayer: currentPlayer === 1 ? 2 : 1,
      blackCaptures: newBlackCaptures,
      whiteCaptures: newWhiteCaptures,
    };

    // 切斷未來的 history (如果我們先 Undo 再落子，未來的紀錄會被覆蓋)
    const newHistory = history.slice(0, step + 1);
    newHistory.push(nextState);

    setHistory(newHistory);
    setStep(newHistory.length - 1);
  };

  const undo = () => setStep(s => Math.max(0, s - 1));
  const redo = () => setStep(s => Math.min(history.length - 1, s + 1));
  const reset = () => {
    setHistory([{
      board: Array(size).fill(null).map(() => Array(size).fill(0)),
      currentPlayer: 1,
      blackCaptures: 0,
      whiteCaptures: 0,
    }]);
    setStep(0);
    setWarning('');
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert("請輸入棋譜名稱");
      return;
    }
    try {
      setIsSaving(true);
      await saveGameToFirebase(title, history.slice(0, step + 1));
      alert("儲存成功！");
      setTitle('');
    } catch (error) {
      alert("儲存失敗，請檢查 console");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="go-board-container">
      <div className="go-board-stats" style={{ display: 'flex', justifyContent: 'space-between', width: `${boardSizePx}px`, marginBottom: '-10px', fontWeight: 'bold' }}>
        <span>總手數: {step}</span>
        <span>黑提子: {blackCaptures} | 白提子: {whiteCaptures}</span>
      </div>
      
      <canvas
        ref={canvasRef}
        width={boardSizePx}
        height={boardSizePx}
        onClick={handleCanvasClick}
        className="go-board-canvas"
      />
      
      <div className="go-board-controls">
        <p>目前輪到: {currentPlayer === 1 ? '黑子' : '白子'}</p>
        <button onClick={undo} disabled={step === 0}>← 後退</button>
        <button onClick={redo} disabled={step === history.length - 1}>前進 →</button>
        <button onClick={reset}>清空棋盤</button>
      </div>
      
      <div className="go-board-save" style={{ marginTop: '10px' }}>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="輸入棋譜名稱" 
          style={{ padding: '5px', marginRight: '5px' }}
        />
        <button onClick={handleSave} disabled={isSaving || step === 0}>
          {isSaving ? '儲存中...' : '儲存棋譜'}
        </button>
      </div>
      
      {warning && <div className="go-board-warning" style={{ color: 'red', fontWeight: 'bold' }}>{warning}</div>}
    </div>
  );
};

export default GoBoard;
