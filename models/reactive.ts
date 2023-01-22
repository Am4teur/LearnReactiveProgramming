import { filter, from, tap } from "rxjs";

const framesStream1 = ["frame1", "frame2", "frame3"];
// const framesStream2 = ["wrong-frame1", "frame2", "frame3"];
// const framesStream3 = ["frame1", "frame2", "frame3"];

const obs$ = from(["frame1", "frame2", "frame3"]).pipe(
  filter((e: any) => e === "react-icon")
  // tap((e: any) => {}),
  // map((e: any) => console.log(e))
);

export const obsFunction$ = (observer: any) =>
  observer.pipe(
    tap(console.log),
    filter((e: string) => e === "react-icon")
    // tap((e: any) => {}),
    // map((e: any) => console.log(e))
  );
