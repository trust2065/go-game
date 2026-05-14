import { applyMove, Cell } from './src/utils/goLogic.ts';

const board: Cell[][] = Array(19).fill(null).map(() => Array(19).fill(0));

// Setup: Black surrounds White at 1,1
board[0][1] = 1;
board[2][1] = 1;
board[1][0] = 1;
board[1][1] = 2; // White stone
// Black plays at 1,2
const res = applyMove(board, 1, 2, 1);
console.log("Captured:", res.capturedStones);
console.log("White stone at 1,1:", res.newBoard[1][1]);
