import { motion } from "framer-motion";
import NextImage from "next/image";

interface IStreamGenerator {
  beforePipeFrames: any;
  getFrameSrc: (frame: string) => string;
  animation: any;
}

const variant = {
  init: { opacity: 1, scale: 0, y: 0 },
  visible: {
    opacity: 0,
    scale: 1,
    y: "40vh", // 40vh -> 75vh change for images to go to the <Screen /> (macbook image)
    transition: {
      type: "tween",
      scale: {
        duration: 1,
        delay: 0,
      },
      y: {
        duration: 2,
        delay: 1,
      },
      // comment thisto permanentely show image on <Screen /> (macbook image)
      opacity: {
        duration: 0,
        delay: 3,
      },
    },
  },
};

export const StreamGenerator = ({
  beforePipeFrames,
  getFrameSrc,
  animation,
}: IStreamGenerator) => {
  return (
    <div
      className="generator absolute m-20 flex h-40 w-40
                 items-center justify-center self-start"
    >
      <motion.div className="absolute z-10" animate={animation}>
        <NextImage
          src="/livestream/background/gear-1000.png"
          alt="Stream Generator"
          width={800}
          height={800}
        ></NextImage>
      </motion.div>
      {beforePipeFrames.map((frame: any, i: number) => (
        <motion.div
          key={frame + i}
          className="absolute z-20 flex h-16 w-16 items-center
                     justify-center self-center"
          variants={variant}
          initial={"init"}
          animate={"visible"}
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
  );
};
