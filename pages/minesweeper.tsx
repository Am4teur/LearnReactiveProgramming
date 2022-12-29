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

  const isValid = (i: number, j: number) => {
    return i >= 0 && j >= 0 && i < size && j < size;
  };

  const openMineField = (arr: MineField[][], i: number, j: number) => {
    const dfs = (i: number, j: number) => {
      if (isValid(i, j)) {
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

  const isSquareFlagged = (i: number, j: number): boolean =>
    isValid(i, j) && mineField[i][j].symbol === "🚩";

  const isSquareBomb = (i: number, j: number): boolean =>
    isValid(i, j) && mineField[i][j].minesAround === mine;

  const isSquareEmpty = (i: number, j: number): boolean =>
    isValid(i, j) && mineField[i][j].minesAround === 0;

  const countFlagsAround = (
    squaresAround: number[][],
    i: number,
    j: number
  ): number => {
    return squaresAround.reduce(
      (sum, [x, y]) => sum + (isSquareFlagged(i + x, j + y) ? 1 : 0),
      0
    );
  };

  const openAroundSquare = (i: number, j: number): void => {
    const squaresAround: number[][] = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];
    const numOfFlags = countFlagsAround(squaresAround, i, j);

    if (numOfFlags === mineField[i][j].minesAround) {
      squaresAround.forEach(([x, y]) => {
        if (isSquareBomb(i + x, j + y) && !isSquareFlagged(i + x, j + y)) {
          // Gameover
          console.log("game over square around");
        }
        if (isSquareEmpty(i + x, j + y)) {
          openMineField(mineField, i + x, j + y);
        }
        if (isValid(i + x, j + y) && !isSquareFlagged(i + x, j + y))
          mineField[i + x][j + y].clicked = true;
      });
    }
  };

  const getBackgroundImage = (mine: MineField): string => {
    const mapping: any = {
      0: "bg-0",
      1: "bg-1",
      2: "bg-2",
      3: "bg-3",
      4: "bg-4",
      5: "bg-5",
      6: "bg-6",
      7: "bg-7",
      8: "bg-8",
      "🚩": "bg-flag",
      "❔": "bg-flag_red",
    };

    if (mine.clicked && mine.minesAround === 10) return "bg-mine";
    else if (mine.clicked) return mapping[mine.minesAround];
    else if (mine.symbol !== "") return mapping[mine.symbol];
    else if (!mine.clicked) return "bg-closed";

    return "bg-start";
  };

  const handleLeftClick = (i: number, j: number): void => {
    let newMineField = [...mineField];

    if (newMineField[i][j].symbol) {
      return;
    }

    if (newMineField[i][j].clicked) {
      //check if already has minesAround number of flags
      openAroundSquare(i, j);
    }

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
      <div className="w-full min-h-screen flex flex-col justify-center items-center">
        {mineField.map((row: MineField[], i: number) => (
          <div className="flex" key={i}>
            {row.map((mine: MineField, j: number) => (
              <button
                className={`bg-cover w-16 h-16 ${getBackgroundImage(mine)}`}
                key={`${i} ${j}`}
                onClick={() => handleLeftClick(i, j)}
                onContextMenu={(e) => handleRightClick(e, i, j)}
              ></button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Minesweeper;
