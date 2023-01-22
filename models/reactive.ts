import { filter, from } from "rxjs";

const framesStream1 = ["frame1", "frame2", "frame3"];
// const framesStream2 = ["wrong-frame1", "frame2", "frame3"];
// const framesStream3 = ["frame1", "frame2", "frame3"];

const obs$ = from(["frame1", "frame2", "frame3"]).pipe(
  filter((e: any) => e === "react-icon")
  // tap((e: any) => {}),
  // map((e: any) => console.log(e))
);

export const observableWithInteractiveFunctions = (subject: any) =>
  subject.pipe(
    // distinct()
    filter((e: string) => !e.includes("wrong"))
    // tap((e: any) => console.log(e))
    // take
    // map((e: string) => (e.includes("wrong") ? "rxjs-icon" : e))
    // do several at the same time

    // merge
    // delay(1000)
    // throttleTime(1000)
  );
