export type Player = 1 | 2;
export type Cell = 0 | Player;

export interface Point {
  r: number;
  c: number;
}

export function getAdjacentPoints(r: number, c: number, size: number): Point[] {
  const points: Point[] = [];
  if (r > 0) points.push({ r: r - 1, c });
  if (r < size - 1) points.push({ r: r + 1, c });
  if (c > 0) points.push({ r, c: c - 1 });
  if (c < size - 1) points.push({ r, c: c + 1 });
  return points;
}

export function getGroupAndLiberties(board: Cell[][], startR: number, startC: number) {
  const size = board.length;
  const color = board[startR][startC];
  if (color === 0) return { group: [], liberties: [] };

  const group: Point[] = [];
  const liberties = new Set<string>();
  const visited = new Set<string>();

  const stack: Point[] = [{ r: startR, c: startC }];
  visited.add(`${startR},${startC}`);

  while (stack.length > 0) {
    const { r, c } = stack.pop()!;
    group.push({ r, c });

    const adjacents = getAdjacentPoints(r, c, size);
    for (const adj of adjacents) {
      const key = `${adj.r},${adj.c}`;
      if (board[adj.r][adj.c] === 0) {
        liberties.add(key);
      } else if (board[adj.r][adj.c] === color && !visited.has(key)) {
        visited.add(key);
        stack.push(adj);
      }
    }
  }

  return { group, liberties: Array.from(liberties) };
}

export function applyMove(board: Cell[][], r: number, c: number, color: Player) {
  const size = board.length;
  const newBoard = board.map(row => [...row]);
  newBoard[r][c] = color;

  const opponent: Player = color === 1 ? 2 : 1;
  const adjacents = getAdjacentPoints(r, c, size);
  let capturedStones: Point[] = [];

  // 1. 檢查周圍對手棋子是否氣盡 (吃子)
  for (const adj of adjacents) {
    if (newBoard[adj.r][adj.c] === opponent) {
      const { group, liberties } = getGroupAndLiberties(newBoard, adj.r, adj.c);
      if (liberties.length === 0) {
        // 提子
        group.forEach(p => {
          newBoard[p.r][p.c] = 0;
          capturedStones.push(p);
        });
      }
    }
  }

  // 2. 檢查自身是否氣盡 (禁著點 / 自殺)
  const { liberties: selfLiberties } = getGroupAndLiberties(newBoard, r, c);
  const isSuicide = selfLiberties.length === 0;

  return { newBoard, capturedStones, isSuicide };
}
