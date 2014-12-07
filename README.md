free-mobile-notifier
==================

A simple Free mobile notification sender for Node.js.

## Usage

```js
var Notifier = require('free-mobile-notifier');

var userId = '', apiKey = '', msg = 'Hello World!';
Notifier(userId, apiKey).send(msg, function (err) {
	console.log(err);
});
```

## How to get an API key

Go to Free mobile's website, enable the option named _Notifications par SMS_ and you'll get an API key.
