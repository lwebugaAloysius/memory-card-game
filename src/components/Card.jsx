export default function Card({ isMatched, isOpen, id, fruitType, flipCard }) {
  return (
    <div
      className={isMatched ? "card-tile has-matched" : "card-tile"}
      onClick={() => {
        flipCard(id);
      }}
    >
      <p>{fruitType}</p>
      <div className={isOpen ? "card-tile-cover off" : "card-tile-cover "}>
        ?
      </div>
    </div>
  );
}
