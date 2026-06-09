import { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import GameMessage from "./components/GameMessage";
import CardGrid from "./components/CardGrid";
import Confetti from "react-confetti";
import { fruitsData } from "./fruitsData.js";

export default function App() {
  function shuffleFruitsArray(arr) {
    let copy = [...arr];
    for (let i = arr.length - 1; i > 0; i--) {
      let randomIndex = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[randomIndex]] = [copy[randomIndex], copy[i]];
    }
    return copy;
  }

  const [fruits, setFruits] = useState(shuffleFruitsArray(fruitsData));
  const [selectedFruits, setSelectedFruits] = useState([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);

  let isGameOver = fruits.every((fruit) => fruit.isMatched);

  function resetGame() {
    let newFruits = fruits.map((fruit) => ({
      ...fruit,
      isOpen: false,
      isMatched: false,
    }));
    setFruits(shuffleFruitsArray(newFruits));
    setSelectedFruits([]);
    setScore(0);
    setMoves(0);
  }

  function flipCard(id) {
    setFruits((prevfruits) => {
      return prevfruits.map((fruit) => {
        if (fruit.id === id) {
          if (
            !selectedFruits.includes(fruit.id) &&
            selectedFruits.length < 2 &&
            fruit.isMatched === false
          ) {
            setSelectedFruits((prevSelected) => [...prevSelected, fruit.id]);
          }
          return {
            ...fruit,
            isOpen: true,
          };
        } else {
          return fruit;
        }
      });
    });
  }

  useEffect(() => {
    if (selectedFruits.length < 2) {
      return;
    }

    function handleMatch(fruitOne, fruitTwo, hasMatched) {
      setTimeout(() => {
        setFruits((prevfruits) =>
          prevfruits.map((fruit) => {
            if (fruit.id === fruitOne.id || fruit.id === fruitTwo.id) {
              return {
                ...fruit,
                isMatched: hasMatched,
                isOpen: hasMatched ? fruit.isOpen : false,
              };
            } else {
              return fruit;
            }
          }),
        );
      }, 500);
      setSelectedFruits([]);
    }

    if (selectedFruits.length == 2) {
      setMoves((preMoves) => preMoves + 1);

      let fruitOne = fruits.find((fruit) => fruit.id === selectedFruits[0]);
      let fruitTwo = fruits.find((fruit) => fruit.id === selectedFruits[1]);

      if (fruitOne.fruitType === fruitTwo.fruitType) {
        setScore((prevScore) => prevScore + 1);

        handleMatch(fruitOne, fruitTwo, true);
      } else {
        handleMatch(fruitOne, fruitTwo, false);
      }
    }
  }, [selectedFruits, fruits]);

  return (
    <main className="main-app-container">
      {isGameOver && <Confetti numberOfPieces={500} />}
      <Header resetGame={resetGame} score={score} moves={moves} />
      {isGameOver && <GameMessage moves={moves} />}
      <CardGrid fruitsList={fruits} flipCard={flipCard} />
    </main>
  );
}
