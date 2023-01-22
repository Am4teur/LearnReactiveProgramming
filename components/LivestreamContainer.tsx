import { obsFunction$ } from "@models/reactive";
import { motion } from "framer-motion";
import NextImage from "next/image";
import { useEffect, useRef, useState } from "react";
import { fromEvent, map } from "rxjs";

const LivestreamContainer = () => {
  const buttonEl = useRef<any>(null);
  const count = useRef(0);
  const [frames, setFrames] = useState<string[]>([]);
  const [frames2, setFrames2] = useState<string[]>([]);

  useEffect(() => {
    const obs$ = fromEvent(buttonEl.current, "click").pipe(map(getRandomFrame));

    const interactiveObserver = obsFunction$(obs$);

    const subscriber = obs$.subscribe((e: string) => {
      console.log("1sub", e);

      setFrames((prev) => [...prev, e]);
    });

    const subscriberInteractive = interactiveObserver.subscribe((e: string) => {
      console.log("2sub", e);

      setFrames2((prev) => [...prev, e]);
    });

    return () => {
      subscriber.unsubscribe();
      subscriberInteractive.unsubscribe();
    };
  }, []);

  const getRandomFrame = (): string => {
    count.current = count.current + 1;
    console.log(count.current);

    return ["react-icon", "rxjs-icon"][count.current % 2];
  };

  const getFrameSrc = (frame: string): string =>
    "/livestream/frames/" + frame + ".png";

  const velo = 0.5;

  return (
    <>
      <div className="flex justify-center h-full w-full py-8 bg-slate-400">
        <button
          ref={buttonEl}
          className="absolute left-5 top-5
          bg-[#60dafa] hover:bg-blue-500 border border-[#60dafa] hover:border-blue-500 rounded shadow
          font-bold py-2 px-4"
        >
          Send Event
        </button>

        <div className="generator self-start absolute border-solid border-white border-2 rounded-md w-32 h-32"></div>

        <div
          className="pipe self-center absolute border-solid border-white border rounded-md w-32 h-64
        bg-gray-600"
        ></div>

        <div className="screen self-end absolute border-solid border-white border-2 rounded-md w-32 h-32"></div>

        {frames.map((frame: any, i: number) => (
          <motion.div
            key={i}
            className="self-center absolute flex items-center justify-center
            border-solid border-white border-2 rounded-md w-16 h-16 bg-blue-400"
            initial={{ y: "-500%" }} // hardcoded values
            animate={{ y: "0" }}
            transition={{ duration: velo, ease: "linear" }}
          >
            <NextImage
              src={getFrameSrc(frame)}
              alt="Frame"
              width={640}
              height={640}
            />
          </motion.div>
        ))}
        {frames2.map((frame: any, i: number) => (
          <motion.div
            key={i}
            className="self-center absolute flex items-center justify-center
            border-solid border-black border-2 rounded-md w-16 h-16 bg-blue-400"
            initial={{ y: "0" }}
            animate={{ y: "550%" }} // hardcoded values
            transition={{ delay: velo, duration: velo, ease: "linear" }}
          >
            <NextImage
              src={getFrameSrc(frame)}
              alt="Frame"
              width={640}
              height={640}
            />
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default LivestreamContainer;
