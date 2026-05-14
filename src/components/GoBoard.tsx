import React, { useRef, useEffect, useState } from 'react';
import { applyMove, type Cell, type Player } from '../utils/goLogic';
import './GoBoard.css';

interface GoBoardProps {
  size?: number;
  boardSizePx?: number;
}

const GoBoard: React.FC<GoBoardProps> = ({ size = 19, boardSizePx = 600 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [board, setBoard] = useState<Cell[][]>(
    Array(size).fill(null).map(() => Array(size).fill(0))
  );
  const [currentPlayer, setCurrentPlayer] = useState<Player>(1);
  const [warning, setWarning] = useState<string>('');

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

    const starPoints = size === 19 ? [3, 9, 15] : (size === 13 ? [3, 6, 9] : (size === 9 ? [2, 4, 6] : []));
    ctx.fillStyle = '#000';
    for (const r of starPoints) {
      for (const c of starPoints) {
        ctx.beginPath();
        ctx.arc(padding + c * cellSize, padding + r * cellSize, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

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

    // 應用吃子與禁著點邏輯
    const { newBoard, capturedStones, isSuicide } = applyMove(board, row, col, currentPlayer);

    if (capturedStones && capturedStones.length > 0) {
      console.log(`[吃子] 玩家 ${currentPlayer} 提掉了 ${capturedStones.length} 顆棋子`, capturedStones);
    }

    if (isSuicide) {
      console.warn(`[禁著點] 玩家 ${currentPlayer} 下在無氣的位置`);
      setWarning('⚠️ 禁著點 (無氣)！為方便覆盤仍允許落子');
      setTimeout(() => setWarning(''), 3000);
    } else {
      setWarning('');
    }

    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
  };

  return (
    <div className="go-board-container">
      <canvas
        ref={canvasRef}
        width={boardSizePx}
        height={boardSizePx}
        onClick={handleCanvasClick}
        className="go-board-canvas"
      />
      <div className="go-board-controls">
        <p>目前輪到: {currentPlayer === 1 ? '黑子' : '白子'}</p>
        <button onClick={() => {
          setBoard(Array(size).fill(null).map(() => Array(size).fill(0)));
          setWarning('');
          setCurrentPlayer(1);
        }}>
          清空棋盤
        </button>
      </div>
      {warning && <div className="go-board-warning" style={{ color: 'red', fontWeight: 'bold' }}>{warning}</div>}
    </div>
  );
};

export default GoBoard;
