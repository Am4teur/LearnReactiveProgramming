import { bomb, n_bombs, size, squaresAround } from "./constants";

const randomNumber = () => Math.floor(Math.random() * Math.floor(size));

export const addMines = (arr: any) => {
  for (let i = 0; i < n_bombs; i++) {
    const randX = randomNumber();
    const randY = randomNumber();
    arr[randX][randY] === bomb ? i-- : (arr[randX][randY] = bomb);
  }

  return arr;
};

const mark = (arr: any, x: number, y: number): void =>
  arr[x] !== undefined && arr[x][y] !== undefined
    ? (arr[x][y] += arr[x][y] === bomb ? 0 : 1)
    : null;

export const addMarks = (arr: any) => {
  for (let ri = 0; ri < size; ri++) {
    for (let ci = 0; ci < size; ci++) {
      if (arr[ri][ci] === bomb) {
        squaresAround.forEach(([x, y]) => {
          mark(arr, ri + x, ci + y);
        });
      }
    }
  }
  return arr;
};
