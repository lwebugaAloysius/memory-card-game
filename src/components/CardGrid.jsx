import Card from "./Card";

export default function CardGrid({ fruitsList, flipCard }) {
  let fruitsCardsElements = fruitsList.map((item) => (
    <Card
      key={item.id}
      id={item.id}
      isMatched={item.isMatched}
      isOpen={item.isOpen}
      fruitType={item.fruitType}
      flipCard={flipCard}
    />
  ));
  return <section className="card-grid">{fruitsCardsElements}</section>;
}
