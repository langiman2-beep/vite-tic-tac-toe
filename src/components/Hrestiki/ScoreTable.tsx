import styles from "./ScoreTable.module.css";

interface PlayerScore {
  name: string;
  playerWins: number;
  compWins: number;
  draws?: number;
}

interface ScoreTableProps {
  score: PlayerScore[]; // Массив из игроков
  onFullReset: () => void; // Функция сброса
}

function ScoreTable({ score, onFullReset }: ScoreTableProps) {
  return (
    <div className={styles.container}>
      <div className={styles.headerBlock}>
        <h3 className={styles.title}>Турнірна Таблиця</h3>
        <button className={styles.resetBtn} onClick={onFullReset}>
          Скинути все
        </button>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Гравець</th>
            <th className={styles.th}>Перемоги гравця</th>
            <th className={styles.th}>Перемоги комп'ютера</th>
            <th className={styles.th}>Нічиї</th>
          </tr>
        </thead>
        <tbody>
          {score.map((player, index) => (
            <tr key={index}>
              <td className={styles.td}>{player.name}</td>
              <td className={styles.td}>{player.playerWins}</td>
              <td className={styles.td}>{player.compWins}</td>
              <td className={styles.td}>{player.draws || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ScoreTable;
