import { type ReactNode, type ButtonHTMLAttributes } from "react"; // Добавили строгое слово type!
import styles from "./Button.module.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "start" | "stop" | "ai" | "table" | "default";
}

function Button({
  children,
  variant = "default",
  className = "",
  ...props
}: ButtonProps) {
  const variantClass =
    variant === "start"
      ? styles.start
      : variant === "stop"
        ? styles.stop
        : variant === "ai"
          ? styles.ai
          : variant === "table"
            ? styles.table
            : "";

  return (
    <button className={`${styles.btn} ${variantClass} ${className}`} {...props}>
      {children}
    </button>
  );
}

export default Button;
