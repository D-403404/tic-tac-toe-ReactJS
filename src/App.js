import logo from "./logo.svg";
import "./App.css";
import Tile from "./components/Tile";
import { useState } from "react";

function Board({ xNext, squares, onPlay }) {
  function handleClick(i) {
    console.log("Clicked!");
    if (checkWinner(squares) || squares[i]) return;
    const nextSquares = squares.slice();
    if (xNext) nextSquares[i] = "X";
    else nextSquares[i] = "O";
    onPlay(nextSquares);
  }

  function checkWinner(squares) {
    let lines = [
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
      if (
        squares[lines[i][0]] &&
        squares[lines[i][0]] === squares[lines[i][1]] &&
        squares[lines[i][0]] === squares[lines[i][2]]
      ) {
        return [squares[lines[i][0]], lines[i]];
      }
    }
    return null;
  }

  let isNotNull = (value) => value != null;
  const winner = checkWinner(squares);
  let status;
  if (winner) status = "Winner: " + winner[0];
  else if (squares.filter(isNotNull).length === 9) status = "Stalemate";
  else status = "Next: " + (xNext ? "X" : "O");

  return (
    <>
      <div>{status}</div>
      {[0, 1, 2].map((row) => (
        <div className="board-row" key={row}>
          {[0, 1, 2].map((col) => {
            const value = row * 3 + col;
            if (winner && (value === winner[1][0] || value === winner[1][1] || value === winner[1][2]))
            return (
              <Tile
                format='highlighted'
                value={squares[value]}
                onSquareClick={() => handleClick(value)}
                key={value}
              />
            );
            else
            return (
              <Tile
                format='square'
                value={squares[value]}
                onSquareClick={() => handleClick(value)}
                key={value}
              />
            );
          })}
        </div>
      ))}
    </>
  );
}

function Game() {
  const [history, setHistory] = useState([[Array(9).fill(null), 0]]);
  const [currMove, setCurrMove] = useState(0);
  // const currMove = history.length - 1;
  const xNext = currMove % 2 === 0;
  const currSquares = history[currMove];

  const [order, setOrder] = useState(true);
  const sortDesc = order ? "Sort descending" : "Sort ascending";
  // const [dispMoves, setDispMoves] = useState(history.slice(0, currMove + 1));
  const dispMoves = order
    ? history.slice(0, currMove)
    : history.slice(0, currMove).reverse();

  function handlePlay(nextSquares) {
    const nextHistory = [
      ...history.slice(0, currMove + 1),
      [nextSquares, currMove + 1],
    ];
    setHistory(nextHistory);
    setCurrMove(nextHistory.length - 1);
  }

  function jumpTo(step) {
    setCurrMove(step);
  }

  function sortMove() {
    setOrder(!order);
    console.log(...dispMoves);
  }

  const moves = dispMoves.map((move) => {
    console.log(move);
    let description;
    if (move[1] > 0) description = "Go to step #" + move[1];
    else description = "Go to game start";
    // console.log(...history);

    return (
      <li key={move[1]}>
        <button onClick={() => jumpTo(move[1])}>{description}</button>
      </li>
    );
  });

  return (
    <div>
      <div>
        <Board xNext={xNext} squares={currSquares[0]} onPlay={handlePlay} />
      </div>
      <div>
        <button onClick={sortMove}>{sortDesc}</button>
        <ol>
          {order && (
            <div>
              {moves}
              <li>You are at move #{currMove}</li>
            </div>
          )}
          {!order && (
            <div>
              <li>You are at move #{currMove}</li>
              {moves}
            </div>
          )}
        </ol>
      </div>
    </div>
  );
}

export default Game;
