import NextImage from "next/image";

interface PipeProps {
  /*
   * Wheter the Pipe image is hidden
   */
  isHidden?: boolean;
}

export const Pipe = ({ isHidden = false }: PipeProps) => {
  // TODO idea: loading/ status bar filling logic...
  return (
    <div className="pipe absolute z-20 h-72 w-72 self-center">
      <NextImage
        className={`z-30 ${isHidden ? "invisible" : ""}`}
        src="/livestream/background/pipe-1000.png"
        alt="Pipe"
        fill
      ></NextImage>
    </div>
  );
};
