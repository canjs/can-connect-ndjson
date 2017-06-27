@module {connect.Behavior} can-connect-ndjson
@parent ecosystem
@package ../package.json

@description Connect to a NDJSON stream service.

@signature `ndjsonStream( baseConnection )`

Overwrites the [can-connect/connection.getListData] and [can-connect/constructor.hydrateList] methods to enable NDJSON streaming by implementing `fetch` with a `ReadableStream` response. 

    @param {String} NDJSON service endpoint

@body
## Use

In this example, we will connect a `DefineMap` model to an NDJSON stream service. 

Follow these steps to get started:
#### 1. Define your `Todo` model. 

```js
const DefineList = require("can-define/list/list");
const DefineMap = require("can-define/map/map");

// Define class
const Todo = DefineMap.extend("Todo", {id: "number", name: "string"}); 
Todo.List = DefineList.extend({"#": Todo});
```

#### 2. Define the required behaviors.
These four behaviors are the minumum required behaviors.

```js
const ndjsonStream = require("can-connect-ndjson");

//Define required behaviors, including can-connect-ndjson
const behaviors = [
    require("can-connect/data/url/url"),
    require("can-connect/constructor/constructor"),
    require("can-connect/can/map/map"),
    require("can-connect-ndjson") //require NDJSON behavior
];
```

#### 3.Combine `can-connect` with your model by attaching a `connection` method to your model that calls `connect` with the behaviors and options.
For ndjsonStream support, you must pass the `ndjson` property with the NDJSON API endpoint as a configuration option.

```js
const connect = require("can-connect");
// Create connection and pass the NDJSON API endpoint
Todo.connection = connect(behaviors, {
    Map: Todo,
    List: Todo.List,
    url: "/other/endpoint",
    ndjson: "/api" //declare the NDJSON API endpoint here
});
```

#### 4. Use your `can-connect` methods on your model.
You can use your methods as [`ReadableStreams`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream).

```js
let todoItemPromise = Todo.getList({}); //GET request returns a promise that resolves to one line of your NDJSON stream at a time.
```
Assuming your raw NDJSON data looks like the example below, your `Todo.getList({})` promise will return one line as a JS Object at a time. For example: `{desc:"first", complete: false}` is one line of your NDJSON parsed into a JS object.

```js
//NDJSON raw data example
{"desc":"first", "complete": false}\n
{"desc":"second", "complete": false}\n
{"desc":"third", "complete": false}\n
{"desc":"fourth", "complete": true}\n
```

#### Here it is all together

We use our `ndjsonStream` behavior to enable our class to work seamlessly with a stream of NDJSON, which it will parse into a [`ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) of JavaScript objects. 

Note that you must pass the `ndjsonStream` behavior and also the NDJSON service endpoint into the connect method.

```js
const ndjsonStream = require("can-connect-ndjson");
const connect = require("can-connect");
const DefineList = require("can-define/list/list");
const DefineMap = require("can-define/map/map");

// Define class
const Todo = DefineMap.extend("Todo", {id: "number", name: "string"}); 
Todo.List = DefineList.extend({"#": Todo});

//Define required behaviors, including can-connect-ndjson
const behaviors = [
    require("can-connect/data/url/url"),
    require("can-connect/constructor/constructor"),
    require("can-connect/can/map/map"),
    require("can-connect-ndjson") //require NDJSON behavior
];

// Create connection and pass the NDJSON API endpoint
Todo.connection = connect(behaviors, {
    Map: Todo,
    List: Todo.List,
    url: "/other/endpoint",
    ndjson: "/api" //declare the NDJSON API endpoint here
});

let todoItemPromise = Todo.getList({}); //GET request returns a promise that resolves to one line of your NDJSON stream at a time.
```

## Using `fetch` with NDJSON and `ReadableStreams`
Learn about using the [`fetch API`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) with NDJSON and `ReadableStreams` [here]().

## Parsing a stream of NDJSON to a stream of JS Objects
Learn about how we parse the NDJSON stream into a ReadableStream of JS objects using the `can-ndjson-stream` module [here](./can-ndjson-stream.html).

## Creating an NDJSON service using Express
Checkout the [this tutorial]() or the [can-ndjson-stream](./can-ndjson-stream.html#CreatinganNDJSONstreamservicewithNodeJS_) module documentation.