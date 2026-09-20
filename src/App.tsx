import Hrestiki from "./components/Hrestiki/Hrestiki";
import "./App.css"; // Подключаем твой родной файл со всеми неоновыми стилями!

function App() {
  return (
    <div className="App">
      <header className="App-header"></header>

      <main className="game-section">
        <Hrestiki />
      </main>
    </div>
  );
}

export default App;
