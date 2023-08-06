import { filter, from, Subject } from "rxjs";

const array: string[] = ["rxjs", "react", "angular", "vue"];

// 1. Observables (Streams)
const observableFromArray$ = from(array);

// 2. Observer
export const observableWithPipe = (observable$: any) => {
  return (
    observable$
      // 3. Piping (Operators)
      .pipe(
        filter((e: string) => !e.includes("rxjs"))
        // map((e: string) => (e.includes("wrong") ? "rxjs-icon" : e))
        // tap()
        // tap((event: any) => alert(event)),
        // delay(1000)
        // throttleTime(1000)
        // distinct()
        // take()
        // merge()
      )
  );
};

// 4. Subscription
const subscription = observableFromArray$.subscribe((event: any) =>
  console.log(event)
);
subscription.unsubscribe();

// 5. Subject
const subject = new Subject();
