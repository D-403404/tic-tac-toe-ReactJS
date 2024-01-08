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
    onPlay(nextSquares, i);
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
      <div className="button">{status}</div>
      <div className="board-row">
        <Tile format="square !bg-cyan-300" />
        {[0, 1, 2].map((col) => (
          <Tile format="square !bg-cyan-300" value={col} key={col} />
        ))}
      </div>
      {[0, 1, 2].map((row) => (
        <div className="board-row" key={row}>
          <Tile format="square !bg-cyan-300" value={row} key={row} />
          {[0, 1, 2].map((col) => {
            const value = row * 3 + col;
            if (
              winner &&
              (value === winner[1][0] ||
                value === winner[1][1] ||
                value === winner[1][2])
            )
              return (
                <Tile
                  format="highlighted"
                  value={squares[value]}
                  onSquareClick={() => handleClick(value)}
                  key={value}
                />
              );
            else
              return (
                <Tile
                  format="square"
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
  const [history, setHistory] = useState([
    [Array(9).fill(null), 0, [null, null, null]],
  ]);
  // [Array(9), step#, [symbol, row, col]]
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

  function handlePlay(nextSquares, i) {
    const nextHistory = [
      ...history.slice(0, currMove + 1),
      [nextSquares, currMove + 1, [nextSquares[i], Math.floor(i / 3), i % 3]],
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
    if (move[1] > 0)
      description =
        "Go to step #" +
        move[1] +
        ": " +
        move[2][0] +
        "(" +
        move[2][1] +
        "," +
        move[2][2] +
        ")";
    else description = "Go to game start";
    // console.log(...history);

    return (
      <li key={move[1]}>
        <button className="button" onClick={() => jumpTo(move[1])}>
          {description}
        </button>
      </li>
    );
  });

  return (
    <div className="w-full h-[100vh] bg-gradient-to-r from-cyan-500 to-blue-700">
      <div>
        <Board xNext={xNext} squares={currSquares[0]} onPlay={handlePlay} />
      </div>
      <div>
        <button className="button !mt-[10px] !mb-[10px]" onClick={sortMove}>
          {sortDesc}
        </button>
        <ol>
          {order && <div>{moves}</div>}
          <li className="button !bg-cyan-200">
            You are at move #{currMove}
            {currMove > 0 && (
              <div className="inline">
                : {history[currMove][2][0]}({history[currMove][2][1]},
                {history[currMove][2][2]}){" "}
              </div>
            )}
          </li>
          {!order && <div>{moves}</div>}
        </ol>
      </div>
      {/* <div className="text-3xl font-bold underline bg-red mt-[10px]">sasdasda</div> */}
    </div>
  );
}

export default Game;
