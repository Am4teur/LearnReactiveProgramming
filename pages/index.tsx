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
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="">
        <button onClick={goToMinesweeper}>Go to minesweeper</button>
      </main>
    </>
  );
}
