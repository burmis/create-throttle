import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { createThrottle } from "./mod.ts";
import { TimeError } from 'https://deno.land/std@0.165.0/testing/time.ts';

// TODO: CLEAN UP FILE SOMEHOW (move helper functions to seperate file and import?)

// Promise function for testing.
const testPromise = (): Promise<any> => {
  return new Promise((resolve) => {
    resolve(null);
  })
};
//end

//Test throttle is returning Promise
const throttleReturnTest = createThrottle({
  limit: 1,
  interval: 100,
})

Deno.test(function createThrottle() {
  assertEquals(throttleReturnTest(() => testPromise()), testPromise());
})
//end

//Test throttle is operating correctly
async function testThrottle(intervalCallLimit: number, intervalTime:number, invokeCount:number): Promise<boolean> {

  //Create test throttle
  const throttleTimingTest = createThrottle({
    limit: intervalCallLimit,
    interval: intervalTime,
  });

  //Test pass/failure time. 
  // Subtract one interval to account for immediate initial invocation.
  const expectedMinTime =  (invokeCount / intervalCallLimit * intervalTime) - intervalTime;

  //Begin test
  const startTime = new Date();

  let actualInvokeCount = 0;

  while (actualInvokeCount < invokeCount) {
    await throttleTimingTest(() => testPromise()).then(() => {
      actualInvokeCount++;
    });
  }

  const endTime = new Date();

  const actualTime = endTime.getTime() - startTime.getTime();

  console.log("testing throttle with " + invokeCount + " invokes with " + intervalCallLimit + " calls per " + intervalTime + "ms");

  if (actualTime < expectedMinTime) {
    throw new TimeError(`Expected time to be longer than ${expectedMinTime} but was ${actualTime}`);
  }

  if (actualInvokeCount !== invokeCount) {
    throw new Error(`Expected invoke count to be ${invokeCount} but was ${actualInvokeCount}`);
  }

  console.log("test ... ok");
  return Promise.resolve(true);
}

Deno.test(async function TestThrottle() {
  // Run five random tests
  for (let i = 0; i < 5; i++) {
    const limit = Math.floor(Math.random() * 10) + 1;
    const interval = Math.floor(Math.random() * 200) + 1;
    const invokeCount = Math.floor(Math.random() * 10) + 1;

    assertEquals(await testThrottle(limit, interval, invokeCount), true);
  }
})
