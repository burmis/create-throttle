[![Test Deno Module](https://github.com/burmis/create-throttle/actions/workflows/test.yml/badge.svg)](https://github.com/burmis/create-throttle/actions/workflows/test.yml)

# create-throttle hook

This package contains a function you can use to create a throttle. Once a
throttle is created you can call it passing in your own function to execute.

The throttle will execute your function immediately, and then wait for interval
to complete before resolving. This allows you to limit the number of times a
function is called in a given interval.

## Example Usage

```js
const throttle = createThrottle({
  limit: 3, // number of calls allowed in the interval
  interval: 100, // in milliseconds
});

await throttle(async () => console.log("Test Function 1")); // This will be called immediately
await throttle(async () => console.log("Test Function 2")); // This will be called immediately
await throttle(async () => console.log("Test Function 3")); // This will be called immediately
await throttle(async () => console.log("Test Function 4")); // This will be called after the 100ms interval has passed
```

## Running Tests

```bash
deno task check
```

## Publishing to NPM

```bash
deno task publish
```

## Other Tasks

Run this command to print out all available tasks.

```bash
deno task
```
