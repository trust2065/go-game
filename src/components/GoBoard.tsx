import React, { useRef, useEffect, useState } from 'react';
import './GoBoard.css';

// 0: Empty, 1: Black, 2: White
type Player = 1 | 2;
type Cell = 0 | Player;

interface GoBoardProps {
  size?: number; // Board size, e.g., 19
  boardSizePx?: number; // Visual size in pixels
}

const GoBoard: React.FC<GoBoardProps> = ({ size = 19, boardSizePx = 600 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [board, setBoard] = useState<Cell[][]>(
    Array(size).fill(null).map(() => Array(size).fill(0))
  );
  const [currentPlayer, setCurrentPlayer] = useState<Player>(1);

  const padding = 30; // Padding from edge of canvas to the outer lines
  const gridWidth = boardSizePx - padding * 2;
  const cellSize = gridWidth / (size - 1);

  // Draw board and stones
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, boardSizePx, boardSizePx);

    // Draw grid lines
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)'; // 0.5px line simulation
    ctx.lineWidth = 1;

    for (let i = 0; i < size; i++) {
      const pos = padding + i * cellSize;
      // Vertical line
      ctx.moveTo(pos, padding);
      ctx.lineTo(pos, boardSizePx - padding);
      // Horizontal line
      ctx.moveTo(padding, pos);
      ctx.lineTo(boardSizePx - padding, pos);
    }
    ctx.stroke();

    // Draw star points (hoshi)
    const starPoints = size === 19 ? [3, 9, 15] : (size === 13 ? [3, 6, 9] : (size === 9 ? [2, 4, 6] : []));
    ctx.fillStyle = '#000';
    for (const r of starPoints) {
      for (const c of starPoints) {
        ctx.beginPath();
        ctx.arc(padding + c * cellSize, padding + r * cellSize, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Draw stones
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const cell = board[r][c];
        if (cell === 0) continue;

        const x = padding + c * cellSize;
        const y = padding + r * cellSize;
        const radius = cellSize * 0.48;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);

        if (cell === 1) { // Black
          const gradient = ctx.createRadialGradient(x - radius * 0.3, y - radius * 0.3, radius * 0.1, x, y, radius);
          gradient.addColorStop(0, '#555');
          gradient.addColorStop(1, '#000');
          ctx.fillStyle = gradient;
          
          // Shadow
          ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
          ctx.shadowBlur = 4;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
        } else { // White
          const gradient = ctx.createRadialGradient(x - radius * 0.3, y - radius * 0.3, radius * 0.1, x, y, radius);
          gradient.addColorStop(0, '#fff');
          gradient.addColorStop(1, '#ddd');
          ctx.fillStyle = gradient;
          
          // Shadow
          ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
          ctx.shadowBlur = 4;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
        }

        ctx.fill();
        
        // Reset shadow for next drawing
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      }
    }
  }, [board, size, boardSizePx, cellSize]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Convert pixel to grid coordinates
    const col = Math.round((x - padding) / cellSize);
    const row = Math.round((y - padding) / cellSize);

    // Check bounds
    if (col < 0 || col >= size || row < 0 || row >= size) return;

    // Check if cell is empty
    if (board[row][col] !== 0) return;

    // Place stone
    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = currentPlayer;
    setBoard(newBoard);

    // Toggle player
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
        <p>Current Player: {currentPlayer === 1 ? 'Black' : 'White'}</p>
        <button onClick={() => setBoard(Array(size).fill(null).map(() => Array(size).fill(0)))}>
          Reset Board
        </button>
      </div>
    </div>
  );
};

export default GoBoard;
