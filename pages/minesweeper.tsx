// RxJS v6+
import { map, of } from "rxjs";
// import { renderMinefield, renderScore, renderGameOver } from './html-renderer';
import { mine, size } from "@models/constants";
import { addMarks, addMines } from "@models/mines";
import { useCallback, useEffect, useState } from "react";

type Symbol = "🚩" | "❔" | "";
type GameState = "" | "W" | "L";

interface MineField {
  minesAround: number;
  clicked: boolean;
  symbol: Symbol;
  start: boolean;
}

const Minesweeper = (): JSX.Element => {
  const [score, setScore] = useState(0);
  const [isEasyStart, setIsEasyStart] = useState<boolean>(true);
  const [gameState, setGameState] = useState<GameState>("");
  const [mineField, setMineField] = useState<MineField[][]>(
    Array(size)
      .fill(0)
      .map(() =>
        Array(size).fill({
          minesAround: -1,
          clicked: false,
          symbol: "",
          start: false,
        })
      )
  );

  function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  const addClicked = (mines: number[][]): MineField[][] => {
    const zeros: { x: number; y: number }[] = [];
    const newMines = mines.map((row: number[], i: number) =>
      row.map((elem: number, j: number) => {
        if (elem === 0) {
          zeros.push({ x: i, y: j });
        }
        return {
          minesAround: elem,
          clicked: false,
          symbol: "" as Symbol,
          start: false,
        };
      })
    );

    if (isEasyStart) {
      const coord: { x: number; y: number } = zeros[getRandomInt(zeros.length)];
      newMines[coord.x][coord.y].start = true;
    }

    return newMines;
  };

  const getMinesSubscription = useCallback(() => {
    const mines$ = of(
      Array(size)
        .fill(0)
        .map(() => Array(size).fill(0))
    ).pipe(map(addMines), map(addMarks), map(addClicked));

    return mines$.subscribe(setMineField);
  }, []);

  useEffect(() => {
    const sub = getMinesSubscription();

    return sub.unsubscribe();
  }, [getMinesSubscription]);

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
          handleGameOver();
        }
        if (isSquareEmpty(i + x, j + y)) {
          openMineField(mineField, i + x, j + y);
        }
        if (isValid(i + x, j + y) && !isSquareFlagged(i + x, j + y)) {
          mineField[i + x][j + y].clicked = true;
          handleIfWinner(mineField);
        }
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

    if (mine.start) return "bg-start";
    if (mine.clicked && mine.minesAround === 10) return "bg-mine";
    if (mine.clicked && mine.minesAround === 11) return "bg-mine_red";
    else if (mine.clicked) return mapping[mine.minesAround];
    else if (mine.symbol !== "") return mapping[mine.symbol];
    else return "bg-closed";
  };

  const openAllMineField = () => {
    let newMineField = [...mineField];
    newMineField.forEach((row: any) => {
      row.forEach((mine: any) => {
        mine.clicked = true;
      });
    });

    setMineField(newMineField);
  };

  const handleIfWinner = (mineField: MineField[][]) => {
    for (let i = 0; i < mineField.length; i++) {
      for (let j = 0; j < mineField[i].length; j++) {
        if (mineField[i][j].minesAround !== mine && !mineField[i][j].clicked)
          return false;
      }
    }
    setGameState("W");
  };

  const handleGameOver = () => {
    setGameState("L");
    openAllMineField();
  };

  const handleReset = () => {
    getMinesSubscription();
    setGameState("");
  };

  const handleLeftClick = (i: number, j: number): void => {
    if (!!gameState) {
      return;
    }

    let newMineField = [...mineField];

    if (newMineField[i][j].clicked) {
      openAroundSquare(i, j);
    } else {
      if (newMineField[i][j].symbol) {
        return;
      }

      newMineField[i][j].minesAround === 0
        ? (newMineField = openMineField(newMineField, i, j))
        : null;

      newMineField[i][j].clicked = true;
      newMineField[i][j].start = false;
      if (newMineField[i][j].minesAround === mine) {
        newMineField[i][j].minesAround = mine + 1;
        handleGameOver();
      } else console.log(handleIfWinner(newMineField));

      setMineField(newMineField);
    }
  };

  const handleRightClick = (e: any, i: number, j: number) => {
    e.preventDefault();
    if (!!gameState) {
      return;
    }

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
      <p>
        {!!gameState
          ? gameState === "L"
            ? "Game Over"
            : "You Won!"
          : "Game is On"}
      </p>
      <p>Score: {score}</p>
      <div className="w-full min-h-screen flex flex-col justify-center items-center">
        <button
          className={`bg-cover w-16 h-16 bg-reset`}
          onClick={handleReset}
        ></button>
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
