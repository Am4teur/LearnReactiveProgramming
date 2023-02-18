import NextImage from "next/image";

export const Pipe = () => {
  // loading/ status bar filling logic...
  return (
    <div className="pipe absolute z-20 h-72 w-72 self-center">
      <NextImage
        className="z-30"
        src="/livestream/background/pipe-1000.png"
        alt="Pipe"
        fill
      ></NextImage>
    </div>
  );
};
