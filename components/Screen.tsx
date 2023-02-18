import { motion } from "framer-motion";
import NextImage from "next/image";

interface IScreen {
  afterPipeFrames: any;
  getFrameSrc: (frame: string) => string;
  velo: number;
}

export const Screen = ({ afterPipeFrames, getFrameSrc, velo }: IScreen) => {
  return (
    <div className="screen absolute flex h-40 w-40 items-center justify-center self-end">
      <NextImage
        className="absolute z-10"
        src="/livestream/background/macbook-1000.png"
        alt="Macbook"
        width={1000}
        height={1000}
      ></NextImage>
      {afterPipeFrames.map((frame: any, i: number) => (
        <motion.div
          key={i}
          className="absolute flex h-16 w-16
                    items-center justify-center"
          initial={{ y: "-40vh" }}
          animate={{ y: "0" }} // hardcoded values
          transition={{
            delay: velo,
            duration: velo,
            type: "tween",
            ease: "linear",
          }}
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
