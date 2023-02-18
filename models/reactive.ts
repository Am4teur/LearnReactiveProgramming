import { filter, from, Observable, tap } from "rxjs";

// 1. Streams
const streamOfStrings: string[] = ["frame1", "frame2", "frame3"];
const streamOfIcons: string[] = [];

// 2. Observables
const simpleObservable$ = new Observable();
const fromObservable$ = from(streamOfStrings);
const fromObservable2$ = from(streamOfStrings)
  .pipe()
  .subscribe((event: string) => console.log(event));

// 3. Pipping
export const observableWithInteractiveFunctions = (observable$: any) =>
  observable$.pipe(
    // 3.1. Operators
    // tap()
    tap((event: any) => alert(event)),
    // filter()
    filter((event: string) => !event.includes("angular"))
    // map()
    // map((e: string) => (e.includes("wrong") ? "rxjs-icon" : e))

    // delay(1000)
    // throttleTime(1000)
    // distinct()
    // take
    // merge
  );

// 5. Subscription
// 6. Subject
