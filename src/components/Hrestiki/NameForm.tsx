import { useState, type FormEvent } from "react";
import Button from "../../ui/Button";
import styles from "./NameForm.module.css";

interface NameFormProps {
  onNameSubmit: (name: string) => void;
  isNameEntered: boolean;
  isGameActive: boolean;
}

function NameForm({
  onNameSubmit,
  isNameEntered,
  isGameActive,
}: NameFormProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim()) onNameSubmit(name.trim());
    setName("");
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {!isNameEntered ? (
        <h2 className={styles.title}>Введіть ім'я гравця для початку гри!</h2>
      ) : null}

      {/* Обернули инпут и кнопку в один общий ряд для компактности */}
      <div className={styles.inputRow}>
        <input
          type="text"
          value={name}
          disabled={isGameActive}
          onChange={(e) => setName(e.target.value)}
          placeholder="Твоє ім'я, Командир"
          className={styles.input}
        />

        <Button variant="ai" type="submit" className={styles.submitBtn}>
          Ввести
        </Button>
      </div>
    </form>
  );
}

export default NameForm;
