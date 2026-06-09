export default function Header({ resetGame, score, moves }) {
  return (
    <div className="header">
      <h1 className="game-title">🎮 Memory Card Game</h1>
      <div className="score-moves-container">
        <div className="score-container">
          <p className="score-title">Score:</p>
          <p className="score-value">{score}</p>
        </div>
        <div className="moves-container">
          <p className="moves-title">Moves:</p>
          <p className="moves-value">{moves}</p>
        </div>
      </div>
      <button className="new-game-btn" onClick={resetGame}>
        New Game
      </button>
    </div>
  );
}
