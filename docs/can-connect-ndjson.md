@module {connect.Behavior} can-connect-ndjson
@parent can-ecosystem
@package ../package.json

@description Connect to a NDJSON stream service.

@signature `ndjsonStream( baseConnection )`

Overwrites the [can-connect/connection.getListData] and [can-connect/constructor.hydrateList] methods on the 
[can-connect `can-connect`] base connection to enable NDJSON streaming.

@param {String} NDJSON service endpoint


@body
## Use

In this example, we will connect a [can-define/map/map `DefineMap`] model to an NDJSON stream service. If you 
prefer to use your own model library or a simple constructor, skip step 1 and [can-connect#Otheruse modify the behaviors] 
in step 2 to suit your data structure.

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
These four behaviors are the minumum required behaviors if you choose to use [can-define/map/map `DefineMap`]s and 
[can-define/list/list `DefineList`]s for your model layer. `can-connect` is flexible and can be used with any 
array-like type.

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
You may pass an optional NDJSON-specific endpoint as an option.

```js
const connect = require("can-connect");
// Create connection and pass the optional NDJSON API endpoint
Todo.connection = connect(behaviors, {
    Map: Todo,
    List: Todo.List,
    url: "/other/endpoint",
    ndjson: "/api" //declare the NDJSON API endpoint here
});
```

#### 4. Use your `can-connect` methods on your model.
`getList` now supports a [`ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) response object, which will be pushed into the list instance as JavaScript objects. Each item in the list represents one line of your NDJSON data.

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

We use our `ndjsonStream` behavior to enable our class to work seamlessly with a stream of NDJSON, which it will parse into an array of JS objects. 

Note that you must pass the `ndjsonStream` behavior and also the NDJSON service endpoint into the connect method. If no NDJSON endpoint is passed, it will default to the `url`.

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

let todoItemPromise = Todo.getList({}); //GET request returns a promise that resolves to one line of your NDJSON data at a time.
```

## Using `fetch` with NDJSON and `ReadableStreams`
Learn about using the [`fetch API`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) with NDJSON and `ReadableStreams` [here]().

## Parsing a stream of NDJSON to a stream of JS Objects
Learn about how we parse the NDJSON stream into a ReadableStream of JS objects using [can-ndjson-stream `can-ndjson-stream`].

## Creating an NDJSON service using Express
Checkout the [this tutorial]() or the [can-ndjson-stream#CreatinganNDJSONstreamservicewithNodeJS_ `can-ndjson-stream`] module documentation.