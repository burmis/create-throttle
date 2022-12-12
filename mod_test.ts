/*
* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
*
*                                             THROTTLE
*
* Throttle is a package that helps limit the number of times a function can be called within a given time
* interval. Functions are placed in a queue style system and are invoked as time ticks along. This is useful
* for limiting the number of API calls made to a server, for example.
*
* ./mod.ts is the main module of the package.
* ./mod_test.ts is the test module of the package.
*
* CONTRIBUTORS:
*
* @byronlanehill
* @markbennett
* @nashtronaut
*
*  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
*/

import {
  assertEquals,
  assertNotEquals,
} from "https://deno.land/std@0.167.0/testing/asserts.ts";
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

    // Schedule all the calls to our function through the throttle.
    for (let i = 0; i < 5; i++) {
      throttle(throttledFunction);
    }

    // Tick for first invocation.
    time.tick(0);
    const startTime = time.now;

    for (let i = 0; i < 4; i++) {
      assertNotEquals(count, i + 2); // Check throttle is not ahead of invocation count.
      assertEquals(count, i + 1); // Check throttle is on track with invocation count.
      assertNotEquals(count, i); // Check throttle is not lagging behind invocation count.
      time.tick(period); // Tick for each subsequent invocation.

      // Check that throttle is not exceeding the call limit within the interval.
      if (count > 3 && time.now - startTime < 100) {
        throw new Error("Throttle is exceeding call limit.");
      }
    }
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
