import { useState, useEffect, useMemo } from "react";
import "./App.css";
import Header from "./components/Header";
import GameMessage from "./components/GameMessage";
import CardGrid from "./components/CardGrid";
import Confetti from "react-confetti";
import { fruitsData } from "./fruitsData.js";

function shuffleFruitsArray(arr) {
  const copy = [...arr];

  for (let i = copy.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));

    [copy[i], copy[randomIndex]] = [
      copy[randomIndex],
      copy[i],
    ];
  }

  return copy;
}

function createGameBoard() {
  return shuffleFruitsArray(
    fruitsData.map((fruit) => ({
      ...fruit,
      isOpen: false,
      isMatched: false,
    }))
  );
}

export default function App() {
  const [fruits, setFruits] = useState(createGameBoard);
  const [selectedFruits, setSelectedFruits] = useState([]);

  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);

  const [time, setTime] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);

  const [wins, setWins] = useState(
    () => Number(localStorage.getItem("wins")) || 0
  );

  const [bestScore, setBestScore] = useState(
    () => Number(localStorage.getItem("bestScore")) || Infinity
  );

  const [bestTime, setBestTime] = useState(
    () => Number(localStorage.getItem("bestTime")) || Infinity
  );

  const isGameOver = useMemo(
    () => fruits.every((fruit) => fruit.isMatched),
    [fruits]
  );

  const accuracy =
    moves > 0
      ? Math.round((score / moves) * 100)
      : 100;

  function resetGame() {
    setFruits(createGameBoard());
    setSelectedFruits([]);
    setScore(0);
    setMoves(0);

    setTime(0);
    setPaused(false);
    setIsChecking(false);

    setCombo(0);
    setBestCombo(0);
  }

  function flipCard(id) {
    if (paused) return;
    if (isChecking) return;

    const clickedFruit = fruits.find(
      (fruit) => fruit.id === id
    );

    if (!clickedFruit) return;
    if (clickedFruit.isMatched) return;
    if (clickedFruit.isOpen) return;
    if (selectedFruits.length >= 2) return;

    setFruits((prevFruits) =>
      prevFruits.map((fruit) =>
        fruit.id === id
          ? {
              ...fruit,
              isOpen: true,
            }
          : fruit
      )
    );

    setSelectedFruits((prev) => [...prev, id]);
  }

  useEffect(() => {
    if (paused || isGameOver) return;

    const interval = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [paused, isGameOver]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      const key = e.key.toLowerCase();

      if (key === "r") {
        resetGame();
      }

      if (key === "p" && !isGameOver) {
        setPaused((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyPress
      );
  }, [isGameOver]);

  useEffect(() => {
    if (selectedFruits.length !== 2) return;

    setIsChecking(true);
    setMoves((prev) => prev + 1);

    const [firstId, secondId] = selectedFruits;

    const fruitOne = fruits.find(
      (fruit) => fruit.id === firstId
    );

    const fruitTwo = fruits.find(
      (fruit) => fruit.id === secondId
    );

    if (!fruitOne || !fruitTwo) {
      setSelectedFruits([]);
      setIsChecking(false);
      return;
    }

    const hasMatched =
      fruitOne.fruitType === fruitTwo.fruitType;

    const timer = setTimeout(() => {
      setFruits((prevFruits) =>
        prevFruits.map((fruit) => {
          const isSelected =
            fruit.id === firstId ||
            fruit.id === secondId;

          if (!isSelected) return fruit;

          if (hasMatched) {
            return {
              ...fruit,
              isMatched: true,
            };
          }

          return {
            ...fruit,
            isOpen: false,
          };
        })
      );

      if (hasMatched) {
        setScore((prev) => prev + 1);

        setCombo((prev) => {
          const next = prev + 1;

          setBestCombo((best) =>
            Math.max(best, next)
          );

          return next;
        });
      } else {
        setCombo(0);
      }

      setSelectedFruits([]);
      setIsChecking(false);
    }, 700);

    return () => clearTimeout(timer);
  }, [selectedFruits, fruits]);

  useEffect(() => {
    document.title = `🍓 Score: ${score} | Moves: ${moves}`;
  }, [score, moves]);

  useEffect(() => {
    if (!isGameOver) return;

    document.title = "🎉 You Won!";

    const updatedWins = wins + 1;

    setWins(updatedWins);
    localStorage.setItem("wins", updatedWins);

    if (moves < bestScore) {
      setBestScore(moves);
      localStorage.setItem("bestScore", moves);
    }

    if (time < bestTime) {
      setBestTime(time);
      localStorage.setItem("bestTime", time);
    }

    console.table({
      wins: updatedWins,
      score,
      moves,
      time,
      accuracy,
      combo,
      bestCombo,
      bestScore:
        moves < bestScore ? moves : bestScore,
      bestTime:
        time < bestTime ? time : bestTime,
    });
  }, [
    isGameOver,
    wins,
    moves,
    time,
    accuracy,
    combo,
    bestCombo,
    bestScore,
    bestTime,
    score,
  ]);

  return (
    <main className="main-app-container">
      {isGameOver && (
        <Confetti
          recycle={false}
          numberOfPieces={500}
        />
      )}

      <Header
        resetGame={resetGame}
        score={score}
        moves={moves}
      />

      {isGameOver && (
        <GameMessage moves={moves} />
      )}

      <CardGrid
        fruitsList={fruits}
        flipCard={flipCard}
      />
    </main>
  );
}
