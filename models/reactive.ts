import { from, map, tap } from "rxjs";

const framesStream1 = ["frame1", "frame2", "frame3"];
// const framesStream2 = ["wrong-frame1", "frame2", "frame3"];
// const framesStream3 = ["frame1", "frame2", "frame3"];

const obs$ = from(["frame1", "frame2", "frame3"]).pipe(
  tap((e: any) => {}),
  map((e: any) => console.log(e))
);
