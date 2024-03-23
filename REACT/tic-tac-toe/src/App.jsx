import { useState, useEffect } from "react";

function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [player, setPlayer] = useState("X");
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [playerNames, setPlayerNames] = useState({ X: "", O: "" });
  const [askedForNames, setAskedForNames] = useState(false);

  useEffect(() => {
    setDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);

    if (!askedForNames) {
      setShowNameModal(true);
      setAskedForNames(true);
    }
  }, [askedForNames]);

  const handleClick = (index) => {
    if (board[index] === null && !winner) {
      const newBoard = [...board];
      newBoard[index] = player;
      setBoard(newBoard);
      setPlayer(player === "X" ? "O" : "X");
      checkWinner(newBoard, index);
    }
  };

  const checkWinner = (board, index) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a]);
        setWinningLine([a, b, c]);
        setScores({ ...scores, [board[a]]: scores[board[a]] + 1 });
        setShowWinnerModal(true);
        return;
      }
    }

    if (!board.includes(null)) {
      setWinner("draw");
      setShowWinnerModal(true);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setPlayer("X");
    setWinner(null);
    setWinningLine([]);
    setShowWinnerModal(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handlePlayerNames = (playerX, playerO) => {
    setPlayerNames({ X: playerX, O: playerO });
    setShowNameModal(false);
  };

  const resetEverything = () => {
    setPlayerNames({ X: "", O: "" });
    setScores({ X: 0, O: 0 });
    setShowNameModal(true);
  };

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen ${
        darkMode ? "bg-gray-800 text-white" : "bg-gray-100"
      }`}
    >
      <div className="flex justify-between w-full mb-8">
        <h1 className="text-4xl font-bold mx-auto">Tic Tac Toe</h1>
        <button
          className={`absolute top-4 right-4 ${
            darkMode
              ? "bg-gray-600 hover:bg-gray-500"
              : "bg-gray-300 hover:bg-gray-400"
          } text-white font-bold py-2 px-4 rounded`}
          onClick={toggleDarkMode}
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {board.map((value, index) => (
          <button
            key={index}
            className={`w-20 h-20 text-4xl font-bold rounded-lg shadow-md ${
              value === "X"
                ? `${
                    darkMode
                      ? "text-red-500 bg-gray-700"
                      : "text-red-500 bg-white"
                  }`
                : value === "O"
                ? `${
                    darkMode
                      ? "text-blue-500 bg-gray-700"
                      : "text-blue-500 bg-white"
                  }`
                : `${darkMode ? "bg-gray-700" : "bg-white"}`
            } ${winningLine.includes(index) ? "bg-green-300" : ""}`}
            onClick={() => handleClick(index)}
          >
            {value}
          </button>
        ))}
      </div>
      <div className="flex justify-between mb-8">
        <div className="mr-8">
          <div className="text-xl font-bold mb-2">
            {playerNames.X || "Player X"}
          </div>
          <div className="text-2xl font-bold text-red-500">{scores.X}</div>
        </div>
        <div>
          <div className="text-xl font-bold mb-2">
            {playerNames.O || "Player O"}
          </div>
          <div className="text-2xl font-bold text-blue-500">{scores.O}</div>
        </div>
      </div>
      <div className="mb-8">
        <span className="text-lg font-bold">Current Move: </span>
        <span
          className={`text-2xl font-bold ${
            player === "X" ? "text-red-500" : "text-blue-500"
          }`}
        >
          {playerNames[player] || `Player ${player}`}
        </span>
      </div>
      <button
        className={`${
          darkMode
            ? "bg-red-600 hover:bg-red-500"
            : "bg-red-500 hover:bg-red-600"
        } text-white font-bold py-2 px-4 rounded`}
        onClick={resetEverything}
      >
        Reset Game
      </button>

      {showWinnerModal && (
        <div
          className={`fixed top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white ${
            darkMode ? "bg-gray-700" : "bg-white"
          } p-8 rounded-lg shadow-md z-10`}
        >
          <div>
            <div className="text-xl font-bold mb-4">
              {winner === "draw"
                ? "It's a draw!"
                : `Player ${
                    winner === "X" ? playerNames.X : playerNames.O
                  } wins!`}
            </div>
            <div className="flex justify-between">
              <button
                className={`${
                  darkMode
                    ? "bg-green-600 hover:bg-green-500"
                    : "bg-green-500 hover:bg-green-600"
                } text-white font-bold py-2 px-4 rounded`}
                onClick={resetGame}
              >
                Play Again
              </button>
              <button
                className={`${
                  darkMode
                    ? "bg-red-600 hover:bg-red-500"
                    : "bg-red-500 hover:bg-red-600"
                } text-white font-bold py-2 px-4 rounded`}
                onClick={resetGame}
              >
                Quit
              </button>
            </div>
          </div>
        </div>
      )}

      {showNameModal && (
        <div
          className={`fixed top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white ${
            darkMode ? "bg-gray-700" : "bg-white"
          } p-8 rounded-lg shadow-md z-10`}
        >
          <div>
            <div className="text-xl font-bold mb-4">Enter Player Names</div>
            <div className="flex mb-4">
              <input
                className={`${
                  darkMode ? "bg-gray-600 text-white" : "bg-gray-200"
                } mr-2 px-4 py-2 rounded`}
                placeholder="Player X"
                value={playerNames.X}
                onChange={(e) =>
                  setPlayerNames({ ...playerNames, X: e.target.value })
                }
              />
              <input
                className={`${
                  darkMode ? "bg-gray-600 text-white" : "bg-gray-200"
                } ml-2 px-4 py-2 rounded`}
                placeholder="Player O"
                value={playerNames.O}
                onChange={(e) =>
                  setPlayerNames({ ...playerNames, O: e.target.value })
                }
              />
            </div>
            <button
              className={`${
                darkMode
                  ? "bg-green-600 hover:bg-green-500"
                  : "bg-green-500 hover:bg-green-600"
              } text-white font-bold py-2 px-4 rounded`}
              onClick={() => handlePlayerNames(playerNames.X, playerNames.O)}
            >
              Start Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
