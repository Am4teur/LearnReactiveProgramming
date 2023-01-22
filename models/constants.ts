export const bomb: number = 10;
export const size: number = 10;
export const n_bombs: number = 15;
export const squaresAround: number[][] = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

export const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max);
};
