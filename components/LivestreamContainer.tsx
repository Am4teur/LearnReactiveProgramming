import { getRandomInt } from "@models/constants";
import { observableWithPipe } from "@models/reactive";
import { useAnimationControls } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Subject, fromEvent } from "rxjs";
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

    const interactiveObservable = observableWithPipe(subject$);

    // after executing interactive operators/functions from reactive.ts
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
    ["react-icon", "rxjs-icon", "angular-icon", "vue-icon"][getRandomInt(4)];

  const getFrameSrc = (frame: string): string =>
    "/livestream/frames/" + frame + ".png";

  const velo = 2;

  return (
    <>
      <div className="flex h-full w-full justify-center bg-gradient-to-bl from-[#41D8DD] to-[#5583EE]">
        {/* This button is on top of StreamGenerator because I cannot pass the logic of the onClick inside the StreamGenerator
         since I have to access information on the parent component */}
        <div>
          <button
            ref={buttonEl}
            className="relative z-30 m-20 h-40 w-40 rounded-full hover:bg-transparentGray"
            onClick={sequence}
          ></button>
        </div>

        <div className="absolute m-4 items-start rounded border border-solid border-white bg-gray-500 p-4 text-center">
          Click on the gear to generate an image
        </div>

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
