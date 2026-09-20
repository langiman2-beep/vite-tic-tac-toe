interface PlayerScore {
  name: string;
  playerWins: number;
  compWins: number;
  draws?: number;
}

interface HandleClickParams {
  index: number;
  board: (string | null)[];
  gameStarted: boolean;
  xIsNext: boolean;
  playerName: string;
  score: PlayerScore[];
  calculateWinner: (board: (string | null)[]) => string | null;
  setBoard: (board: (string | null)[]) => void;
  setWinnerMessage: (msg: string) => void;
  setScore: (score: PlayerScore[]) => void;
  setGameStarted: (started: boolean) => void;
  setXIsNext: (next: boolean) => void;
}

/**
 * Исправленная логика обработки клика — теперь без читерства со стороны ИИ!
 */
export function processCellClick({
  index,
  board,
  gameStarted,
  xIsNext,
  playerName,
  score,
  calculateWinner,
  setBoard,
  setWinnerMessage,
  setScore,
  setGameStarted,
  setXIsNext,
}: HandleClickParams): void {
  // 1. Проверяем, можно ли вообще кликнуть в эту клетку
  if (!gameStarted || board[index] !== null || calculateWinner(board)) return;

  // 2. Запоминаем, КТО именно сейчас делает ход
  const currentSign = xIsNext ? "X" : "O";

  // 3. Ставим знак в клетку
  const newBoard = [...board];
  newBoard[index] = currentSign;
  setBoard(newBoard);

  // 4. Проверяем победу СТРОГО после этого конкретного хода
  const roundWinner = calculateWinner(newBoard);
  const isDraw = !roundWinner && newBoard.every((cell) => cell !== null);

  if (roundWinner) {
    // Если на доске победил текущий знак
    const existingPlayer = score.find((p) => p.name === playerName);
    let pWins = 0;
    let cWins = 0;

    if (currentSign === "X") {
      pWins = 1;
      setWinnerMessage(playerName); // Победа игрока!
    } else {
      cWins = 1;
      setWinnerMessage("Комп'ютер"); // Честная победа компа
    }

    let newScore: PlayerScore[];
    if (existingPlayer) {
      newScore = score.map((p) =>
        p.name === playerName
          ? {
              ...p,
              playerWins: p.playerWins + pWins,
              compWins: p.compWins + cWins,
            }
          : p,
      );
    } else {
      newScore = [
        ...score,
        { name: playerName, playerWins: pWins, compWins: cWins, draws: 0 },
      ];
    }

    setScore(newScore);
    localStorage.setItem("hrestiki_score", JSON.stringify(newScore));
    setGameStarted(false);
  } else if (isDraw) {
    // Если ничья
    const existingPlayer = score.find((p) => p.name === playerName);
    let newScore: PlayerScore[];

    if (existingPlayer) {
      newScore = score.map((p) =>
        p.name === playerName ? { ...p, draws: (p.draws || 0) + 1 } : p,
      );
    } else {
      newScore = [
        ...score,
        { name: playerName, playerWins: 0, compWins: 0, draws: 1 },
      ];
    }

    setScore(newScore);
    localStorage.setItem("hrestiki_score", JSON.stringify(newScore));
    setWinnerMessage(""); // Пустая строка означает ничью
    setGameStarted(false);
  } else {
    // Если никто не победил и не ничья — строго передаём ход следующему!
    setXIsNext(!xIsNext);
  }
}
