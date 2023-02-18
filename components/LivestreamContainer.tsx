import { getRandomInt } from "@models/constants";
import { observableWithInteractiveFunctions } from "@models/reactive";
import { useAnimationControls } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { fromEvent, Subject } from "rxjs";
import { Pipe } from "./Pipe";
import { Screen } from "./Screen";
import { StreamGenerator } from "./StreamGenerator";

const LivestreamContainer = () => {
  const buttonEl = useRef<any>(null);
  const [beforePipeFrames, setBeforePipeFrames] = useState<string[]>([]);
  const [afterPipeFrames, setAfterPipeFrames] = useState<string[]>([]);

  // generator animation because of 'send event' button
  const times = useRef(0);
  const animation = useAnimationControls();
  const sequence = async () => {
    await animation.start({
      rotate: 360 * ++times.current,
      transition: { ease: "easeOut", duration: 1.5 },
    });
  };

  useEffect(() => {
    const subject$ = new Subject<string>();
    fromEvent(buttonEl.current, "click").subscribe(() =>
      subject$.next(getRandomFrame())
    ); // subject pattern to add new event to stream/observable

    const interactiveObservable = observableWithInteractiveFunctions(subject$);

    // after executing interactive operators/functions
    const interactiveSubscription = interactiveObservable.subscribe(
      (e: string) => setAfterPipeFrames((prev) => [...prev, e])
    );

    // before executing interactive operators/functions
    const subscription = subject$.subscribe((e: string) =>
      setBeforePipeFrames((prev) => [...prev, e])
    );

    return () => {
      subscription.unsubscribe();
      interactiveSubscription.unsubscribe();
    };
  }, []);

  const getRandomFrame = (): string =>
    ["react-icon", "rxjs-icon", "angular-icon"][getRandomInt(3)];

  const getFrameSrc = (frame: string): string =>
    "/livestream/frames/" + frame + ".png";

  const velo = 2;

  return (
    <>
      <div className="flex h-full w-full justify-center bg-slate-400 py-8">
        <button
          ref={buttonEl}
          className="absolute left-5 top-5
           rounded border border-[#60dafa] bg-[#60dafa] py-2 px-4 font-bold
             shadow hover:border-blue-500 hover:bg-blue-500
             disabled:pointer-events-none disabled:opacity-25"
          onClick={sequence}
        >
          Send Event
        </button>

        <StreamGenerator
          beforePipeFrames={beforePipeFrames}
          getFrameSrc={getFrameSrc}
          animation={animation}
        />

        <Pipe />

        <Screen
          afterPipeFrames={afterPipeFrames}
          velo={velo}
          getFrameSrc={getFrameSrc}
        />
      </div>
    </>
  );
};

export default LivestreamContainer;
