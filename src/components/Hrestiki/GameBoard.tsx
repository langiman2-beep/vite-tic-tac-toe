import styles from "./GameBoard.module.css";

interface GameBoardProps {
  board: (string | null)[];
  gameStarted: boolean;
  onCellClick: (index: number) => void;
}

function GameBoard({ board, gameStarted, onCellClick }: GameBoardProps) {
  return (
    <div className={styles.board}>
      {board.map((cellValue, index) => (
        <button
          key={index}
          className={styles.cell}
          disabled={!gameStarted}
          onClick={() => onCellClick(index)}
        >
          {/* Динамически подкидываем класс: cross для Х, nought для О */}
          <span
            className={`${styles.symbol} ${cellValue === "X" ? styles.cross : cellValue === "O" ? styles.nought : ""}`}
          >
            {cellValue}
          </span>
        </button>
      ))}
    </div>
  );
}

export default GameBoard;
