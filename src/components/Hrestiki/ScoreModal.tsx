import { type MouseEvent } from "react";
import ScoreTable from "./ScoreTable";
import Button from "../../ui/Button";
import styles from "./Hrestiki.module.css"; // Используем те же стили модалки

interface ScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  score: {
    name: string;
    playerWins: number;
    compWins: number;
    draws?: number;
  }[];
  onFullReset: () => void;
}

function ScoreModal({ isOpen, onClose, score, onFullReset }: ScoreModalProps) {
  // Если модалка закрыта — ничего не рендерим
  if (!isOpen) return null;

  const handleOverlayClick = () => {
    onClose();
  };

  const handleContentClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation(); // Чтобы окно не закрывалось при клике внутри таблицы
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent} onClick={handleContentClick}>
        <Button
          variant="stop"
          className={styles.closeModalBtn}
          onClick={onClose}
        >
          ✖ Закрити
        </Button>
        <ScoreTable score={score} onFullReset={onFullReset} />
      </div>
    </div>
  );
}

export default ScoreModal;
