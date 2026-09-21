import { memo } from "react"; // Импортировали броню memo для защиты от перерендеров!
import styles from "./GameBoard.module.css";

interface GameBoardProps {
  board: (string | null)[];
  gameStarted: boolean;
  onCellClick: (index: number) => void;
}

// Обернули всю функцию GameBoard в memo()
const GameBoard = memo(function GameBoard({
  board,
  gameStarted,
  onCellClick,
}: GameBoardProps) {
  return (
    <div className={styles.board}>
      {board.map((cellValue, index) => (
        <button
          key={index}
          className={styles.cell}
          disabled={!gameStarted}
          onClick={() => onCellClick(index)}
        >
          <span
            className={`${styles.symbol} ${cellValue === "X" ? styles.cross : cellValue === "O" ? styles.nought : ""}`}
          >
            {cellValue}
          </span>
        </button>
      ))}
    </div>
  );
});

export default GameBoard;
