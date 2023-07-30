import { filter, from, fromEvent, throttleTime } from "rxjs";

const streamOfStrings: string[] = ["frame1", "frame2", "frame3"];

// 2. Observables
const observableFromArray$ = from(streamOfStrings);

// 3. Pipping
export const observableWithInteractiveFunctions = (
  observable$: any,
  buttonRef: any
) => {
  const observableFromUserEvent$ = fromEvent(buttonRef, "click")
    .pipe(throttleTime(1000))
    .subscribe((event: any) => console.log("event: "));

  return observable$.pipe(
    // 3.1. Operators
    // tap()
    // tap((event: any) => alert(event)),
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
};

// 4. Subscription
// 5. Subject
