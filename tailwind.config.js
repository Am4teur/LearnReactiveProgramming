/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        silver: "#c6c6c6",
        transparentGray: "#00000010",
      },
      backgroundImage: {
        closed:
          "url('../public/minesweeper/minesweeperDesignImages/closed.svg')",
        start: "url('../public/minesweeper/minesweeperDesignImages/start.svg')",
        flag: "url('../public/minesweeper/minesweeperDesignImages/flag.svg')",
        flag_red:
          "url('../public/minesweeper/minesweeperDesignImages/flag_red.svg')",
        mine: "url('../public/minesweeper/minesweeperDesignImages/mine.svg')",
        mine_red:
          "url('../public/minesweeper/minesweeperDesignImages/mine_red.svg')",
        0: "url('../public/minesweeper/minesweeperDesignImages/0.svg')",
        1: "url('../public/minesweeper/minesweeperDesignImages/1.svg')",
        2: "url('../public/minesweeper/minesweeperDesignImages/2.svg')",
        3: "url('../public/minesweeper/minesweeperDesignImages/3.svg')",
        4: "url('../public/minesweeper/minesweeperDesignImages/4.svg')",
        5: "url('../public/minesweeper/minesweeperDesignImages/5.svg')",
        6: "url('../public/minesweeper/minesweeperDesignImages/6.svg')",
        7: "url('../public/minesweeper/minesweeperDesignImages/7.svg')",
        8: "url('../public/minesweeper/minesweeperDesignImages/8.svg')",
        corner_up_left:
          "url('../public/minesweeper/minefieldBorders/corner_up_left.png')",
        corner_up_right:
          "url('../public/minesweeper/minefieldBorders/corner_up_right.png')",
        corner_mid_left:
          "url('../public/minesweeper/minefieldBorders/corner_mid_left.png')",
        corner_mid_right:
          "url('../public/minesweeper/minefieldBorders/corner_mid_right.png')",
        corner_bottom_left:
          "url('../public/minesweeper/minefieldBorders/corner_bottom_left.png')",
        corner_bottom_right:
          "url('../public/minesweeper/minefieldBorders/corner_bottom_right.png')",
        border_hor:
          "url('../public/minesweeper/minefieldBorders/border_hor.png')",
        border_ver:
          "url('../public/minesweeper/minefieldBorders/border_vert.png')",
      },
    },
  },
  plugins: [],
};
