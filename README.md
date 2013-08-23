# eventsource-reconnect

Expose a reconnect method to EventSource allowing for reconnect strategies.

## Example

```js
var EventSource = require("eventsource-reconnect")

var source = new EventSource("http://my.api.uri")

// Bad - Ideally throttle reconnect attempts
source.addEventListener("close", function () {
    source.reconnect()
})

```

## Installation

`npm install eventsource-reconnect`

## Contributors

 - Matt-Esch

## MIT Licenced
