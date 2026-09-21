import { useState, useEffect, useCallback } from "react";
import NameForm from "./NameForm";
import SetupPanel from "./SetupPanel";
import ScoreTable from "./ScoreTable";
import GameBoard from "./GameBoard";
import Button from "../../ui/Button";
import SoundButton from "../../ui/SoundButton";
import { calculateWinner } from "../../helpers.ts";
import { getComputerMove } from "./aiLogic";
import { handleTimerTick } from "./timerLogic";
import { processCellClick } from "./gameLogic";
import {
  startBackgroundMusic,
  stopBackgroundMusic,
  playCellClick,
  playAiClick,
  playMenuClick,
  playTableClick, // Добавили импорт звука таблицы!
  playWinSound,
  playLoseSound,
} from "../../audioLogic";
import styles from "./Hrestiki.module.css";

interface PlayerScore {
  name: string;
  playerWins: number;
  compWins: number;
  draws?: number;
}

const getInitialScore = (): PlayerScore[] => {
  const saved = localStorage.getItem("hrestiki_score");
  if (saved) {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed)) return parsed;
  }
  return [];
};

const getInitialName = (): string => {
  return localStorage.getItem("hrestiki_name") || "";
};

function Hrestiki() {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState<boolean>(true);
  const [playerName, setPlayerName] = useState<string>(getInitialName);
  const [score, setScore] = useState<PlayerScore[]>(getInitialScore);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [smartAI, setSmartAI] = useState<boolean>(true);
  const [timeLeft, setTimeLeft] = useState<number>(5);
  const [winnerMessage, setWinnerMessage] = useState<string>("");
  const [matchScore, setMatchScore] = useState<{
    player: number;
    comp: number;
  }>({ player: 0, comp: 0 });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Стейты управления звуком (по умолчанию всё ВКЛЮЧЕНО)
  const [isMusicOn, setIsMusicOn] = useState<boolean>(true);
  const [isSfxOn, setIsSfxOn] = useState<boolean>(true);

  // Профессиональный запуск фоновой музыки: строго при наличии имени и включенном тумблере
  useEffect(() => {
    if (isMusicOn && playerName) {
      startBackgroundMusic();
    } else {
      stopBackgroundMusic();
    }
  }, [isMusicOn, playerName]);

  const handleNameSubmit = (enteredName: string) => {
    playMenuClick(!isSfxOn); // Издаём сочный клик при вводе
    setPlayerName(enteredName);
    localStorage.setItem("hrestiki_name", enteredName);
  };

  const handleClick = useCallback(
    (index: number) => {
      playCellClick(!isSfxOn);
      setTimeLeft(5);

      processCellClick({
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
      });
    },
    [board, gameStarted, xIsNext, playerName, score, isSfxOn],
  );

  // 1. Таймер обратного отсчета
  useEffect(() => {
    if (!gameStarted || !xIsNext) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const nextTime = handleTimerTick(
          prev,
          score,
          playerName,
          setScore,
          setWinnerMessage,
          setGameStarted,
          () => clearInterval(interval),
        );

        if (nextTime === 0 && prev <= 1) {
          playLoseSound(!isSfxOn);
          setMatchScore((m) => ({ ...m, comp: m.comp + 1 }));
        }
        return nextTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameStarted, xIsNext, score, playerName, isSfxOn]);

  // 2. Мозги ИИ
  useEffect(() => {
    if (!gameStarted || xIsNext) return;

    const timer = setTimeout(() => {
      const targetIndex = getComputerMove(board, smartAI);
      if (targetIndex !== -1) {
        handleClick(targetIndex);
      }
    }, 900);

    return () => clearTimeout(timer);
  }, [gameStarted, xIsNext, board, smartAI, handleClick]);

  const handleStop = () => {
    playMenuClick(!isSfxOn);
    setPlayerName("");
    setGameStarted(false);
    setWinnerMessage("");
    setBoard(Array(9).fill(null));
    setMatchScore({ player: 0, comp: 0 });
    setTimeLeft(5);
  };

  const toggleFirstMove = () => {
    playMenuClick(!isSfxOn);
    setXIsNext(!xIsNext);
    setTimeLeft(5);
  };

  const isDraw =
    !calculateWinner(board) && board.every((cell) => cell !== null);
  const overlayClass = isDraw
    ? styles.overlayDraw
    : winnerMessage === playerName
      ? styles.overlayPlayer
      : styles.overlayComp;

  return (
    <div className={styles.gameContainer}>
      {!playerName && (
        <div className={styles.leftPanel}>
          <NameForm
            onNameSubmit={handleNameSubmit}
            isNameEntered={false}
            isGameActive={false}
          />
          <Button
            variant="table"
            onClick={() => {
              playTableClick(!isSfxOn); // Теперь здесь играет именно ТВОЙ файл table.mp3!
              setIsModalOpen(true);
            }}
            className={styles.ratingBtnSpec}
          >
            🏆 Турнірна Таблиця
          </Button>
        </div>
      )}

      {playerName && (
        <div className={styles.gameControlsZone}>
          <p className={styles.vsText}>
            <span className={styles.playerNameHighlight}>{playerName}</span>
            <span className={styles.vsSpan}> VS </span>
            <button
              disabled={gameStarted}
              onClick={() => {
                playAiClick(!isSfxOn);
                setSmartAI(!smartAI);
              }}
              className={`${styles.vsRowBtn} ${smartAI ? styles.aiSmart : styles.aiDumb}`}
            >
              {smartAI ? "Вумний" : "Дурик"}
            </button>
          </p>

          <div
            className={styles.matchLiveScore}
            style={{ display: "flex", alignItems: "center", gap: "20px" }}
          >
            <SoundButton
              isActive={isMusicOn}
              onClick={() => setIsMusicOn(!isMusicOn)}
              title="Музика"
            >
              🎵
            </SoundButton>

            <span className={`${styles.scoreNum} ${styles.playerColor}`}>
              {matchScore.player}
            </span>
            <span className={styles.scoreDivider}>:</span>
            <span className={`${styles.scoreNum} ${styles.compColor}`}>
              {matchScore.comp}
            </span>

            <SoundButton
              isActive={isSfxOn}
              onClick={() => setIsSfxOn(!isSfxOn)}
              title="Ефекти"
            >
              🔊
            </SoundButton>
          </div>

          <div className={styles.setupRow}>
            <SetupPanel
              isXNext={xIsNext}
              onToggleFirstMove={toggleFirstMove}
              isGameActive={gameStarted}
            />
            {gameStarted && xIsNext && (
              <div className={styles.countdownTimerInline}>{timeLeft}</div>
            )}
          </div>

          <div className={styles.controlsRow}>
            <Button
              variant="start"
              disabled={gameStarted}
              onClick={() => {
                playMenuClick(!isSfxOn);
                setBoard(Array(9).fill(null));
                setWinnerMessage("");
                setTimeLeft(5);
                setGameStarted(true);
                if (!xIsNext) {
                  setXIsNext(false);
                }
              }}
            >
              Старт
            </Button>
            <Button variant="stop" onClick={handleStop}>
              Змінити гравця / Стоп
            </Button>
          </div>
        </div>
      )}

      <div className={`${styles.gameZone} ${styles.relativeZone}`}>
        <GameBoard
          board={board}
          gameStarted={gameStarted}
          onCellClick={handleClick}
        />

        {(winnerMessage || isDraw) && (
          <div
            className={`${styles.boardWinnerOverlay} ${overlayClass}`}
            onClick={() => {
              if (winnerMessage === "Комп'ютер") {
                playLoseSound(!isSfxOn);
                setMatchScore((prev) => ({ ...prev, comp: prev.comp + 1 }));
              } else if (winnerMessage === playerName) {
                playWinSound(!isSfxOn);
                setMatchScore((prev) => ({ ...prev, player: prev.player + 1 }));
              } else {
                playMenuClick(!isSfxOn);
              }
              setWinnerMessage("");
              setBoard(Array(9).fill(null));
              setTimeLeft(5);
            }}
          >
            <div className={styles.overlayText}>
              {winnerMessage ? `Переміг: ${winnerMessage}!` : "Нічия!"}
              <span className={styles.clickToResetHint}>
                Клікни по полю, чтобы грати знов
              </span>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="stop"
              className={styles.closeModalBtn}
              onClick={() => setIsModalOpen(false)}
            >
              ✖ Закрити
            </Button>
            <ScoreTable
              score={score}
              onFullReset={() => {
                playMenuClick(!isSfxOn);
                localStorage.removeItem("hrestiki_score");
                setScore([]);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Hrestiki;
