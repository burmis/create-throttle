/**
 * Return a function that can be used as a wrapper around other functions to limit
 * their invocations to a certain number per interval of time, placing the rest
 * into a queue and invoking them as time goes on.
 */
export function createThrottle<T>({
  limit,
  interval,
}: {
  limit: number;
  interval: number;
}): (func: <T>() => Promise<T>) => Promise<T> {
  let lastInvocation: number | null = null;

  const period = interval / limit;

  return (func) => {
    const currentInvocation = new Date().getTime();

    let timeout = 0;

    /*
     * If less than 'period' seconds have passed since the last invocation
     * determine the seconds until the period will have passed and set the
     * timeout to that value
     **/
    if (lastInvocation && currentInvocation < lastInvocation + period) {
      timeout = lastInvocation + period - currentInvocation;
    }

    lastInvocation = currentInvocation + timeout;

    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          resolve(await func());
        } catch (e) {
          reject(e);
        }
      }, timeout);
    });
  };
}
