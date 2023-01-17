import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { fromEvent } from "rxjs";

const LivestreamContainer = () => {
  const buttonEl = useRef<any>(null);
  const [arr, setArr] = useState<any[]>([]);

  useEffect(() => {
    const obs$ = fromEvent(buttonEl.current, "click").pipe();

    const subscriber = obs$.subscribe((clickety: any) =>
      setArr((prev) => [...prev, clickety.timeStamp])
    );

    return () => subscriber.unsubscribe();
  }, []);

  const addRandom = () => {
    // obs$.next(Math.random());
  };

  return (
    <>
      <div className="h-full w-full flex flex-col items-center justify-center">
        <motion.div
          className="absolute left-0 right-0 top-0 bottom-0 m-auto border-solid border-white border-2 rounded-md w-64 h-64 bg-blue-400"
          initial={{ y: "-200%" }}
          animate={{ y: "0" }}
          transition={{ delay: 4, duration: 2, ease: "linear" }}
        ></motion.div>
        <motion.div
          className="absolute left-0 right-0 top-0 bottom-0 m-auto border-solid border-white border-2 rounded-md w-64 h-64 bg-blue-400"
          initial={{ y: "-200%" }}
          animate={{ y: "0" }}
          transition={{ delay: 2, duration: 2, ease: "linear" }}
        ></motion.div>
        <motion.div
          className="absolute left-0 right-0 top-0 bottom-0 m-auto border-solid border-white border-2 rounded-md w-64 h-64 bg-blue-400"
          initial={{ y: "-200%" }}
          animate={{ y: "0" }}
          transition={{ duration: 2, ease: "linear" }}
        ></motion.div>
        <div className="border-solid border-white border-2  rounded-md w-64 h-64"></div>
        <button
          ref={buttonEl}
          className="absolute left-5 top-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded shadow"
          onClick={addRandom}
        >
          Send Event
        </button>
        {arr.map((val) => (
          <motion.div
            key={val}
            className="absolute left-0 right-0 top-0 bottom-0 m-auto border-solid border-white border-2 rounded-md w-64 h-64 bg-blue-400"
            initial={{ y: "-200%" }}
            animate={{ y: "0" }}
            transition={{ duration: 2, ease: "linear" }}
          ></motion.div>
        ))}
      </div>
    </>
  );
};

export default LivestreamContainer;
