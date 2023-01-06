import Head from "next/head";
import Router from "next/router";

export default function Home(): JSX.Element {
  const goToMinesweeper = () => {
    Router.push("/minesweeper");
  };

  return (
    <>
      <Head>
        <title>Reactive Practical</title>
        <meta name="description" content="Minesweeper Game" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <button onClick={goToMinesweeper}>Go to minesweeper</button>
      </main>
    </>
  );
}
