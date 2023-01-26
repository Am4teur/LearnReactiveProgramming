import { getRandomInt } from "@models/constants";
import { observableWithInteractiveFunctions } from "@models/reactive";
import { motion } from "framer-motion";
import NextImage from "next/image";
import { useEffect, useRef, useState } from "react";
import { fromEvent, Subject } from "rxjs";

const LivestreamContainer = () => {
  const buttonEl = useRef<any>(null);
  const [frames, setFrames] = useState<string[]>([]);
  const [frames2, setFrames2] = useState<string[]>([]);

  useEffect(() => {
    const subject$ = new Subject<string>();
    fromEvent(buttonEl.current, "click").subscribe(() =>
      subject$.next(getRandomFrame())
    ); // subject pattern to add new event to stream/observable

    const interactiveObservable = observableWithInteractiveFunctions(subject$);

    // before executing interactive operators/functions
    const subscription = subject$.subscribe((e: string) =>
      setFrames((prev) => [...prev, e])
    );

    // after executing interactive operators/functions
    const interactiveSubscription = interactiveObservable.subscribe(
      (e: string) => setFrames2((prev) => [...prev, e])
    );

    return () => {
      subscription.unsubscribe();
      interactiveSubscription.unsubscribe();
    };
  }, []);

  const getRandomFrame = (): string =>
    ["react-icon", "rxjs-icon", "rxjs-wrong-icon"][getRandomInt(3)];

  const getFrameSrc = (frame: string): string =>
    "/livestream/frames/" + frame + ".png";

  const velo = 2;

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

        <div className="pipe self-center absolute w-64 h-64 z-10">
          <NextImage
            className="z-30"
            src="/livestream/background/pipe-1000.png"
            alt="Pipe"
            fill
          ></NextImage>
        </div>

        {/* border-solid border-white border-2 */}
        <div className="z-10 screen self-end absolute rounded-md w-32 h-32">
          <NextImage
            src="/livestream/background/macbook-1000.png"
            alt="Macbook"
            width={800}
            height={800}
          ></NextImage>
        </div>

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
            animate={{ y: "535%" }} // hardcoded values
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
