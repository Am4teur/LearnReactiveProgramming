/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        closed: "url('../public/minesweeperDesignImages/closed.svg')",
        start: "url('../public/minesweeperDesignImages/start.svg')",
        flag: "url('../public/minesweeperDesignImages/flag.svg')",
        flag_red: "url('../public/minesweeperDesignImages/flag_red.svg')",
        mine: "url('../public/minesweeperDesignImages/mine.svg')",
        mine_red: "url('../public/minesweeperDesignImages/mine_red.svg')",
        0: "url('../public/minesweeperDesignImages/0.svg')",
        1: "url('../public/minesweeperDesignImages/1.svg')",
        2: "url('../public/minesweeperDesignImages/2.svg')",
        3: "url('../public/minesweeperDesignImages/3.svg')",
        4: "url('../public/minesweeperDesignImages/4.svg')",
        5: "url('../public/minesweeperDesignImages/5.svg')",
        6: "url('../public/minesweeperDesignImages/6.svg')",
        7: "url('../public/minesweeperDesignImages/7.svg')",
        8: "url('../public/minesweeperDesignImages/8.svg')",
      },
    },
  },
  plugins: [],
};
