import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";

const HomePage = () => {
  const [elementCount, setElementCount] = useState(0);
  const [elements, setElements] = useState([]);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentNumber, setCurrentNumber] = useState(1);
  const intervalRef = useRef(null);

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value < 0) {
      Swal.fire({
        title: "Error",
        text: "Number of elements cannot be negative.",
        icon: "error",
        confirmButtonText: "OK",
      });
      setElementCount(0);
    } else {
      setElementCount(value);
    }
  };

  const generateElements = (count) => {
    const newElements = [];
    for (let i = 1; i <= count; i++) {
      newElements.push({
        id: i,
        top: Math.random() * 90 + "%",
        left: Math.random() * 90 + "%",
        zIndex: count - i + 1,
      });
    }
    setElements(newElements);
  };

  const handleElementClick = (id) => {
    if (id === currentNumber) {
      setElements((prevElements) =>
        prevElements.map((element) =>
          element.id === id ? { ...element, bgColor: "red" } : element
        )
      );
      setTimeout(() => {
        setElements((prevElements) =>
          prevElements.filter((element) => element.id !== id)
        );
        if (id === elementCount) {
          Swal.fire({
            title: "All Cleared!",
            text: "You have cleared all the numbers.",
            icon: "success",
            confirmButtonText: "OK",
          });
          clearInterval(intervalRef.current);
        } else {
          setCurrentNumber((prev) => prev + 1);
        }
      }, 300);
    } else {
      Swal.fire({
        title: "Game Over",
        text: "You clicked the wrong number.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
      clearInterval(intervalRef.current);
    }
  };

  const startGame = () => {
    setIsPlaying(true);
    setTime(0);
    setCurrentNumber(1);
    generateElements(elementCount);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setTime((prevTime) => (parseFloat(prevTime) + 0.1).toFixed(1));
    }, 100);
  };

  const handlePlayClick = () => {
    startGame();
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="container mx-auto p-8 w-full h-full">
      <div className="font-bold text-lg mb-2">LET'S PLAY</div>
      <div className="flex mb-2">
        <p className="text-md">Points:</p>
        <input
          type="number"
          placeholder="Enter the number"
          className="border border-black ml-5"
          onChange={handleInputChange}
        />
      </div>
      <div className="flex mb-2">
        <p className="text-md">Time:</p>
        <div className="ml-7">{time}s</div>
      </div>
      <div className="mb-4">
        <button
          className="border border-black w-32 h-8"
          onClick={handlePlayClick}
        >
          {isPlaying ? "Restart" : "Play"}
        </button>
      </div>
      <div className="w-5/6 h-96 border border-black relative">
        {elements.map((element) => (
          <div
            key={element.id}
            id={`element-${element.id}`}
            className="absolute border border-black rounded-full flex items-center justify-center text-xs"
            style={{
              width: "40px",
              height: "40px",
              top: element.top,
              left: element.left,
              backgroundColor: element.bgColor || "white",
              zIndex: element.zIndex,
            }}
            onClick={() => handleElementClick(element.id)}
          >
            {element.id}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
