# can-connect-ndjson

[![Greenkeeper badge](https://badges.greenkeeper.io/canjs/can-connect-ndjson.svg)](https://greenkeeper.io/)

[![Build Status](https://travis-ci.org/canjs/can-connect-ndjson.png?branch=master)](https://travis-ci.org/canjs/can-connect-ndjson)

[![Build Status](https://saucelabs.com/browser-matrix/can-connect-ndjson.svg)](https://saucelabs.com/beta/builds/04de5977a9784f0ebb38d9427166b387)

`Can-connect-ndjson` is a [`can-connect`]() behavior that enables `can-connect` to consume NDJSON stream services. Falls back to `baseConnection` configuration in browsers that do not support `Fetch` or `ReadableStreams`.

## Demo

All the demo code can be found in the `demo/` directory. 

1. To get started install dependencies and run the demo server.

```shell
$ cd demo/
$ npm install
$ node server.js
```

2. Navigate to localhost:8080/demo/can-connect-ndjson.html to see the demo in action. If you open the demo in a browser that does not support `Fetch` or `ReadableStreams`, it will fall back to the `baseConnection` configuration which consumes JSON data.

3. Check out the demo code in `demo/can-connect-ndjson.html`.

![ndjsonStream Visual](ndjsonStream.gif)


## Contributing

### Making a Build

To make a build of the distributables into `dist/` in the cloned repository run

```
npm install
node build
```

### Running the tests

Tests can run in the browser by opening a webserver and visiting the `test.html` page.
Automated tests that run the tests from the command line in Chrome can be run with

```
npm test
```
