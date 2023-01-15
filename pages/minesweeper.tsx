// RxJS v6+
import { map, of } from "rxjs";
// import { renderMinefield, renderScore, renderGameOver } from './html-renderer';
import { bomb, n_bombs, size, squaresAround } from "@models/constants";
import { addMarks, addMines } from "@models/mines";
import NextImage from "next/image";
import { useCallback, useEffect, useState } from "react";
import styles from "../styles/Grid.module.css";

type Symbol = "" | "🚩" | "❔";
type GameState = "" | "W" | "L";

const symbols: { [key in string]: Symbol } = {
  EMPTY: "",
  FLAG: "🚩",
  Q_MARK: "❔",
};

const gameStates: { [key in string]: GameState } = {
  PLAYING: "",
  WINNER: "W",
  LOSER: "L",
};

interface MineField {
  minesAround: number;
  clicked: boolean;
  symbol: Symbol;
  start: boolean;
}

const Minesweeper = (): JSX.Element => {
  const [score, setScore] = useState<number>(n_bombs);
  const [isEasyStart, setIsEasyStart] = useState<boolean>(true);
  const [gameState, setGameState] = useState<GameState>(gameStates.PLAYING);
  const [mineField, setMineField] = useState<MineField[][]>(
    Array(size)
      .fill(0)
      .map(() =>
        Array(size).fill({
          minesAround: -1,
          clicked: false,
          symbol: symbols.EMPTY,
          start: false,
        })
      )
  );

  function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  const addEasyStart = (
    zeros: { x: number; y: number }[],
    newMines: MineField[][]
  ) => {
    if (isEasyStart) {
      if (zeros.length !== 0) {
        const coord: { x: number; y: number } =
          zeros[getRandomInt(zeros.length)];

        newMines[coord.x][coord.y].start = true;
      } else {
        console.error("There is no zeros, thus EasyStart does not exist!");
      }
    }
  };

  const addClicked = useCallback((mines: number[][]): MineField[][] => {
    const zeros: { x: number; y: number }[] = [];
    const newMines: MineField[][] = mines.map((row: number[], i: number) =>
      row.map((elem: number, j: number) => {
        if (elem === 0) {
          zeros.push({ x: i, y: j });
        }
        return {
          minesAround: elem,
          clicked: false,
          symbol: symbols.EMPTY,
          start: false,
        };
      })
    );

    addEasyStart(zeros, newMines);

    return newMines;
  }, []);

  const getMinesSubscription = useCallback(() => {
    const mines$ = of(
      Array(size)
        .fill(0)
        .map(() => Array(size).fill(0))
    ).pipe(map(addMines), map(addMarks), map(addClicked));

    return mines$.subscribe(setMineField);
  }, [addClicked]);

  useEffect(() => {
    const sub = getMinesSubscription();

    return sub.unsubscribe();
  }, [getMinesSubscription]);

  const isValid = (i: number, j: number) =>
    i >= 0 && j >= 0 && i < size && j < size;

  const isSquareFlagged = (i: number, j: number): boolean =>
    isValid(i, j) && mineField[i][j].symbol === symbols.FLAG;

  const isSquareBomb = (i: number, j: number): boolean =>
    isValid(i, j) && mineField[i][j].minesAround === bomb;

  const isSquareEmpty = (i: number, j: number): boolean =>
    isValid(i, j) && mineField[i][j].minesAround === 0;

  const updateScore = (arr: MineField[][]): void => {
    let score: number = n_bombs;
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr[i].length; j++) {
        if (arr[i][j].symbol === symbols.FLAG) score--;
      }
    }
    setScore(score);
  };

  // leetcode: number of islands problem
  const openMineField = (arr: MineField[][], i: number, j: number) => {
    const dfs = (i: number, j: number) => {
      if (isValid(i, j)) {
        if (arr[i][j].minesAround === 0 && arr[i][j].clicked !== true) {
          arr[i][j].clicked = true;
          arr[i][j].symbol = symbols.EMPTY;

          squaresAround.forEach(([x, y]) => {
            dfs(i + x, j + y);
          });
        }

        arr[i][j].clicked = true;
        arr[i][j].symbol = symbols.EMPTY;
      }
    };
    dfs(i, j);

    updateScore(arr);

    return arr;
  };

  const countFlagsAround = (
    squaresAround: number[][],
    i: number,
    j: number
  ): number =>
    squaresAround.reduce(
      (sum, [x, y]) => sum + (isSquareFlagged(i + x, j + y) ? 1 : 0),
      0
    );

  const openAroundSquare = (i: number, j: number): void => {
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
    const mapping: { [key in Symbol]: string } = {
      "": "closed",
      "🚩": "flag",
      "❔": "flag_red",
    };

    if (mine.start) return "start";
    if (mine.clicked && mine.minesAround === bomb) return "mine";
    if (mine.clicked && mine.minesAround === bomb + 1) return "mine_red";
    else if (mine.clicked) return mine.minesAround.toString();
    // else if (mine.symbol !== "")
    else return mapping[mine.symbol];
  };

  const openAllMineField = () => {
    let newMineField = [...mineField];
    newMineField.forEach((row: MineField[]) => {
      row.forEach((mine: MineField) => {
        if (mine.minesAround === bomb) mine.clicked = true;
      });
    });

    setMineField(newMineField);
  };

  const handleIfWinner = (mineField: MineField[][]) => {
    for (let i = 0; i < mineField.length; i++) {
      for (let j = 0; j < mineField[i].length; j++) {
        if (mineField[i][j].minesAround !== bomb && !mineField[i][j].clicked)
          return false;
      }
    }
    setGameState(gameStates.WINNER);
  };

  const handleGameOver = () => {
    setGameState(gameStates.LOSER);
    openAllMineField();
  };

  const handleReset = () => {
    getMinesSubscription();
    setScore(n_bombs);
    setGameState(gameStates.PLAYING);
  };

  const handleLeftClick = (i: number, j: number): void => {
    if (!!gameState || mineField[i][j].symbol) {
      return;
    }

    let newMineField = [...mineField];

    if (newMineField[i][j].clicked) {
      openAroundSquare(i, j);
    } else {
      newMineField[i][j].minesAround === 0
        ? (newMineField = openMineField(newMineField, i, j))
        : null;

      newMineField[i][j].clicked = true;
      newMineField[i][j].start = false;
      if (newMineField[i][j].minesAround === bomb) {
        newMineField[i][j].minesAround = bomb + 1;
        handleGameOver();
      } else handleIfWinner(newMineField);
    }
    setMineField(newMineField);
  };

  const handleRightClick = (e: any, i: number, j: number) => {
    e.preventDefault();
    if (!!gameState || mineField[i][j].clicked) {
      return;
    }

    const newMineField = [...mineField];

    const nextSymbol: { [key in Symbol]: Symbol } = {
      "": symbols.FLAG,
      "🚩": symbols.Q_MARK,
      "❔": symbols.EMPTY,
    };

    newMineField[i][j].symbol = nextSymbol[newMineField[i][j].symbol];
    if (newMineField[i][j].symbol === symbols.FLAG) {
      setScore((prev) => prev - 1);
    } else if (newMineField[i][j].symbol === symbols.Q_MARK) {
      setScore((prev) => prev + 1);
    }

    setMineField(newMineField);
  };

  const getGameStateImage = (): string => {
    const gameStateMapping: { [key in GameState]: string } = {
      "": "/gameState/playing.svg",
      W: "/gameState/winner.svg",
      L: "/gameState/loser.svg",
    };
    return gameStateMapping[gameState];
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <p>Score: {score}</p>

      <div className={styles.minesweeperGrid}>
        <div className="bg-corner_up_left bg-cover"></div>
        <div className="bg-border_hor bg-contain"></div>
        <div className="bg-corner_up_right bg-cover"></div>

        <div className="bg-border_ver bg-contain"></div>
        <div className="flex justify-center py-2 bg-silver">
          <button onClick={handleReset}>
            <NextImage
              src={getGameStateImage()}
              width={64}
              height={64}
              alt="cell"
            ></NextImage>
          </button>
        </div>
        <div className="bg-border_ver bg-contain"></div>

        <div className="bg-corner_mid_left bg-cover"></div>
        <div className="bg-border_hor bg-contain"></div>
        <div className="bg-corner_mid_right bg-cover"></div>

        <div className="bg-border_ver bg-contain"></div>
        <div className="flex flex-col">
          {mineField.map((row: MineField[], i: number) => (
            <div className="flex" key={i}>
              {row.map((mine: MineField, j: number) => (
                <button
                  key={`${i} ${j}`}
                  onClick={() => handleLeftClick(i, j)}
                  onContextMenu={(e) => handleRightClick(e, i, j)}
                >
                  <NextImage
                    src={
                      "/minesweeperDesignImages/" +
                      getBackgroundImage(mine) +
                      ".svg"
                    }
                    width={64}
                    height={64}
                    alt="cell"
                  ></NextImage>
                </button>
              ))}
            </div>
          ))}
        </div>
        <div className="bg-border_ver bg-contain"></div>

        <div className="bg-corner_bottom_left bg-cover"></div>
        <div className="bg-border_hor bg-contain"></div>
        <div className="bg-corner_bottom_right bg-cover"></div>
      </div>
    </div>
  );
};

export default Minesweeper;
