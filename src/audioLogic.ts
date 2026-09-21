// Хак для Vite: автоматически подстраивает пути и для компа (localhost), и для GitHub Pages!
const getAudioPath = (fileName: string) => {
  const base = import.meta.env.BASE_URL || "/";
  // Склеиваем правильный базовый путь с папкой аудио
  return `${base}audio/${fileName}`.replace(/\/+/g, "/");
};

// 1. УПРАВЛЕНИЕ МЕЛОДИЕЙ (Музыка Арабик)
let backgroundMusic: HTMLAudioElement | null = null;

export const startBackgroundMusic = () => {
  if (!backgroundMusic) {
    backgroundMusic = new Audio(getAudioPath("music-arabic.mp3"));
    backgroundMusic.loop = true; // Бесконечный повтор
  }
  backgroundMusic.play().catch((err) => console.log("Ошибка музыки:", err));
};

export const stopBackgroundMusic = () => {
  if (backgroundMusic) {
    backgroundMusic.pause();
  }
};

// 2. УПРАВЛЕНИЕ ЗВУКОВЫМИ ЭФФЕКТАМИ (SFX)
export const playCellClick = (muted: boolean) => {
  if (muted) return;
  new Audio(getAudioPath("button.mp3")).play().catch(() => {});
};

export const playAiClick = (muted: boolean) => {
  if (muted) return;
  new Audio(getAudioPath("gigle.mp3")).play().catch(() => {});
};

export const playMenuClick = (muted: boolean) => {
  if (muted) return;
  new Audio(getAudioPath("button.mp3")).play().catch(() => {});
};

export const playTableClick = (muted: boolean) => {
  if (muted) return;
  new Audio(getAudioPath("table.mp3")).play().catch(() => {});
};

export const playWinSound = (muted: boolean) => {
  if (muted) return;
  new Audio(getAudioPath("u-win.mp3")).play().catch(() => {});
};

export const playLoseSound = (muted: boolean) => {
  if (muted) return;
  new Audio(getAudioPath("over.mp3")).play().catch(() => {});
};
