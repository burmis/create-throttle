# create-throttle hook

## Example Usage

```js
const throttle = createThrottle({
  limit: config.API_REQUEST_LIMIT,
  interval: config.API_REQUEST_INTERVAL,
});

throttle(async () => "Test Function");
```
