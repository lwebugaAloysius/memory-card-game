export default function GameMessage({ moves }) {
  return (
    <div className="message-container">
      <h2>Congragulations🎉</h2>
      <p>
        You completed the game in{" "}
        <span className="game-msg-moves">{moves}</span> moves
      </p>
    </div>
  );
}
