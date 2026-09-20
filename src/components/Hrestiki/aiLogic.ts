// Вот они, наши боевые линии, теперь со всеми цифрами!
const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

/**
 * Функция считает идеальный ход для компьютера
 */
export function getComputerMove(
  board: (string | null)[],
  smartAI: boolean,
): number {
  const emptyCells = board
    .map((cell, i) => (cell === null ? i : null))
    .filter((val): val is number => val !== null);

  if (emptyCells.length === 0) return -1;

  let targetIndex: number | null = null;

  if (smartAI) {
    const mySign = "O";
    const enemySign = "X";

    // 1. Атака
    for (let line of WINNING_LINES) {
      const [a, b, c] = line;
      const values = [board[a], board[b], board[c]];
      if (
        values.filter((v) => v === mySign).length === 2 &&
        values.filter((v) => v === null).length === 1
      ) {
        targetIndex = line[values.indexOf(null)];
        break;
      }
    }

    // 2. Защита
    if (targetIndex === null) {
      for (let line of WINNING_LINES) {
        const [a, b, c] = line;
        const values = [board[a], board[b], board[c]];
        if (
          values.filter((v) => v === enemySign).length === 2 &&
          values.filter((v) => v === null).length === 1
        ) {
          targetIndex = line[values.indexOf(null)];
          break;
        }
      }
    }
  }

  // 3. Рандом
  if (targetIndex === null) {
    targetIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }

  return targetIndex;
}
