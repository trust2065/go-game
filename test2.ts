import { applyMove, Cell } from './src/utils/goLogic.ts';

const board: Cell[][] = Array(19).fill(null).map(() => Array(19).fill(0));

// Setup: Black surrounds 3 White stones at 1,1, 1,2, 1,3
board[0][1] = 1; board[0][2] = 1; board[0][3] = 1;
board[2][1] = 1; board[2][2] = 1; board[2][3] = 1;
board[1][0] = 1;
// board[1][4] will be placed by Black

board[1][1] = 2; board[1][2] = 2; board[1][3] = 2;

// Black plays at 1,4
const res = applyMove(board, 1, 4, 1);
console.log("Captured:", res.capturedStones);
console.log("White stone at 1,1:", res.newBoard[1][1]);
console.log("White stone at 1,2:", res.newBoard[1][2]);
console.log("White stone at 1,3:", res.newBoard[1][3]);
