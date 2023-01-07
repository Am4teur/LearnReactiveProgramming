import { bomb, n_bombs, size } from "./constants";

const randomNumber = () => Math.floor(Math.random() * Math.floor(size));

export const addMines = (arr: any) => {
  for (let i = 0; i < n_bombs; i++) {
    if (arr[randomNumber()][randomNumber()] === bomb) i--;
    arr[randomNumber()][randomNumber()] = bomb;
  }

  return arr;
};

const mark = (arr: any, x: number, y: number) =>
  arr[x] !== undefined && arr[x][y] !== undefined
    ? (arr[x][y] += arr[x][y] === bomb ? 0 : 1)
    : () => {};

export const addMarks = (arr: any) => {
  for (let ri = 0; ri < size; ri++) {
    for (let ci = 0; ci < size; ci++) {
      if (arr[ri][ci] === bomb) {
        mark(arr, ri - 1, ci + 1);
        mark(arr, ri - 1, ci);
        mark(arr, ri - 1, ci - 1);
        mark(arr, ri, ci + 1);
        mark(arr, ri, ci - 1);
        mark(arr, ri + 1, ci + 1);
        mark(arr, ri + 1, ci);
        mark(arr, ri + 1, ci - 1);
      }
    }
  }
  return arr;
};
