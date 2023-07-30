import Head from "next/head";
import Router from "next/router";

export default function Home(): JSX.Element {
  const goToMinesweeper = () => {
    Router.push("/minesweeper");
  };
  const goToLivestream = () => {
    Router.push("/livestreamPage");
  };
  const goToWaterstream = () => {
    Router.push("/waterstreamPage");
  };

  return (
    <>
      <Head>
        <title>Reactive Practical</title>
        <meta name="description" content="Minesweeper Game" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-full w-full">
        <div className="flex h-full w-full flex-col items-center justify-center gap-4">
          <button onClick={goToMinesweeper}>Minesweeper</button>
          <button onClick={goToLivestream}>Livestream</button>
          <button onClick={goToWaterstream}>Waterstream</button>
        </div>
      </main>
    </>
  );
}
