import { type ReactNode, type ButtonHTMLAttributes } from "react";
import styles from "./SoundButton.module.css";

interface SoundButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isActive: boolean; // Флаг состояния: true — включено, false — выключено
}

function SoundButton({
  children,
  isActive,
  className = "",
  ...props
}: SoundButtonProps) {
  // Динамически склеиваем классы в зависимости от состояния
  const statusClass = isActive ? styles.soundOn : styles.soundOff;

  return (
    <button
      className={`${styles.soundBtn} ${statusClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default SoundButton;
