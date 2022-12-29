// RxJS v6+
import { map, of } from "rxjs";
// import { renderMinefield, renderScore, renderGameOver } from './html-renderer';
import { mine, size } from "@models/constants";
import { addMarks, addMines } from "@models/mines";
import { useEffect, useState } from "react";

type Symbol = "🚩" | "❔" | "";

interface MineField {
  minesAround: number;
  clicked: boolean;
  symbol: Symbol;
}

const Minesweeper = (): JSX.Element => {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [mineField, setMineField] = useState<MineField[][]>(
    Array(size)
      .fill(0)
      .map(() =>
        Array(size).fill({
          minesAround: -1,
          clicked: false,
          symbol: "",
        })
      )
  );

  const addClicked = (mines: number[][]): MineField[][] => {
    return mines.map((row: number[]) =>
      row.map((elem: number) => ({
        minesAround: elem,
        clicked: false,
        symbol: "",
      }))
    );
  };

  useEffect(() => {
    const mines$ = of(
      Array(size)
        .fill(0)
        .map(() => Array(size).fill(0))
    ).pipe(map(addMines), map(addMarks), map(addClicked));

    const sub = mines$.subscribe(setMineField);

    return sub.unsubscribe();
  }, []);

  const openMineField = (arr: MineField[][], i: number, j: number) => {
    const dfs = (i: number, j: number) => {
      if (i >= 0 && j >= 0 && i < size && j < size) {
        if (arr[i][j].minesAround === 0 && arr[i][j].clicked !== true) {
          arr[i][j].clicked = true;
          dfs(i + 1, j);
          dfs(i - 1, j);
          dfs(i, j + 1);
          dfs(i, j - 1);

          dfs(i + 1, j + 1);
          dfs(i + 1, j - 1);
          dfs(i - 1, j + 1);
          dfs(i - 1, j - 1);
        }

        arr[i][j].clicked = true;
      }
    };
    dfs(i, j);

    return arr;
  };

  const showMineSquare = (mine: MineField) => {
    if (mine.clicked && mine.minesAround === 10) return "💥";
    else if (mine.clicked) return mine.minesAround;
    else if (mine.symbol !== "") return mine.symbol;
    else if (!mine.clicked) return "";
  };

  const handleLeftClick = (i: number, j: number) => {
    let newMineField = [...mineField];

    // if(newMineField is first time)
    // generate maze with 0 on the clicked position

    newMineField[i][j].minesAround === 0
      ? (newMineField = openMineField(newMineField, i, j))
      : null;

    newMineField[i][j].clicked = true;
    newMineField[i][j].minesAround === mine ? setGameOver(true) : null;

    setMineField(newMineField);
  };

  const handleRightClick = (e: any, i: number, j: number) => {
    e.preventDefault();
    const newMineField = [...mineField];

    const nextSymbol: any = {
      "": "🚩",
      "🚩": "❔",
      "❔": "",
    };

    newMineField[i][j].symbol = nextSymbol[newMineField[i][j].symbol];
    if (newMineField[i][j].symbol === "🚩") {
      setScore((prev) => prev + 1);
    } else if (newMineField[i][j].symbol === "❔") {
      setScore((prev) => prev - 1);
    }

    setMineField(newMineField);
  };

  return (
    <div>
      <p>{gameOver ? "Game Over" : "Game is On"}</p>
      <p>Score: {score}</p>
      <div className="w-full min-h-screen flex flex-col justify-center items-center gap-4">
        {mineField.map((row: MineField[], i: number) => (
          <div className="flex gap-4" key={i}>
            {row.map((mine: MineField, j: number) => (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-16 h-16"
                key={`${i} ${j}`}
                onClick={() => handleLeftClick(i, j)}
                onContextMenu={(e) => handleRightClick(e, i, j)}
              >
                {showMineSquare(mine)}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Minesweeper;
