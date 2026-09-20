import styles from "./SetupPanel.module.css"; // Подключили новый модуль стилей!

interface SetupPanelProps {
  isXNext: boolean;
  onToggleFirstMove: () => void;
  isGameActive: boolean;
}

function SetupPanel({
  isXNext,
  onToggleFirstMove,
  isGameActive,
}: SetupPanelProps) {
  return (
    <div className={styles.setupPanel}>
      <button
        disabled={isGameActive}
        onClick={onToggleFirstMove}
        className={`${styles.turnToggleBtn} ${isXNext ? styles.turnPlayer : styles.turnComp}`}
      >
        {isXNext ? "Хід Гравця" : "Хід Комп'ютера"}
      </button>
    </div>
  );
}

export default SetupPanel;
