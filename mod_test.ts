import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { createThrottle } from "./mod.ts";
import { FakeTime } from "https://deno.land/std@0.167.0/testing/time.ts";

Deno.test(function testCreateThrottle() {
  const testPromise = Promise.resolve("test");
  const createFunction = () => testPromise;
  const throttle = createThrottle({ limit: 1, interval: 1000 });

  assertEquals(throttle(createFunction), testPromise);
});

Deno.test(function testFunctionsAreLimited() {
  // Switch to a fake timer
  const time = new FakeTime();

  try {
    // Create a test throttle with a 100ms limit and a maximum of 3 calls per 100ms
    const throttle = createThrottle({ limit: 3, interval: 100 });
    const period = Math.ceil(100 / 3);

    // Invoke the throttle 5 times
    let count = 0;
    const throttledFunction = () => {
      console.log("throttledFunction");
      return new Promise((resolve) => {
        count++;
        resolve(count);
      });
    };

    // Schedule all the calls to our function
    throttle(throttledFunction);
    throttle(throttledFunction);
    throttle(throttledFunction);
    throttle(throttledFunction);
    throttle(throttledFunction);

    // Tick through three periods (1 interval divided by the limit)
    time.tick(0);
    time.tick(period);
    time.tick(period);
    // Tick to just *before* the interval ends
    // Subraction of 10ms is to account for the time it takes to run the test
    time.tick(period - 10);

    // // Confirm that the first 3 calls are invoked immediately
    assertEquals(count, 3);

    // Confirm that the next 2 calls are invoked after 100ms
    time.tick(2 * period);
    assertEquals(count, 5);
  } catch (e) {
    time.restore();

    throw e;
  } finally {
    try {
      time.restore();
    } catch (_e) {
      // Sometimes time is already restored, so we don't care about this.
    }
  }
});
