interface PlayerScore {
  name: string;
  playerWins: number;
  compWins: number;
  draws?: number;
}

/**
 * Логика секундного тика таймера и технического поражения
 */
export function handleTimerTick(
  prevTime: number,
  score: PlayerScore[],
  playerName: string,
  setScore: (score: PlayerScore[]) => void,
  setWinnerMessage: (msg: string) => void,
  setGameStarted: (started: boolean) => void,
  clearIntervalRef: () => void,
): number {
  if (prevTime <= 1) {
    clearIntervalRef();

    // Считаем техническое поражение
    const existingPlayer = score.find((p) => p.name === playerName);
    let newScore: PlayerScore[];

    if (existingPlayer) {
      newScore = score.map((p) =>
        p.name === playerName ? { ...p, compWins: p.compWins + 1 } : p,
      );
    } else {
      newScore = [
        ...score,
        { name: playerName, playerWins: 0, compWins: 1, draws: 0 },
      ];
    }

    setScore(newScore);
    localStorage.setItem("hrestiki_score", JSON.stringify(newScore));
    setWinnerMessage("Комп'ютер");
    setGameStarted(false);
    return 0;
  }

  return prevTime - 1;
}
