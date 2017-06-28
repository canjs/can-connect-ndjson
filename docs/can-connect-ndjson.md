@module {connect.Behavior} can-connect-ndjson
@parent can-ecosystem @package ../package.json @description Connect to a NDJSON stream service.

@signature `ndjsonStream( baseConnection )`

Overwrites the [can-connect/connection.getListData] and
[can-connect/constructor.hydrateList] methods on the [can-connect
`can-connect`] base connection to enable NDJSON streaming using
[`Fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) with
[`ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)s.

@param {String} NDJSON service endpoint

@body
## Use

In this example, we will connect a [can-define/map/map `DefineMap`] model to an
NDJSON stream service. If you prefer to use a non-CanJS type, skip step 1 and
[can-connect#Otheruse modify the behaviors] in step 2 (can/map in particular)
to suit your data structure.

Follow these steps to get started:
#### 1. Define a model.

```js
const DefineList = require("can-define/list/list");
const DefineMap = require("can-define/map/map");

// Define model
const Todo = DefineMap.extend("Todo", {id: "number", name: "string"}); 
Todo.List = DefineList.extend("TodoList", {"#": Todo});
```

#### 2. Include the required behaviors. These four behaviors are the minumum
required behaviors if you choose to use [can-define/map/map `DefineMap`]s and
[can-define/list/list `DefineList`]s for the model layer. `can-connect` is
flexible and can be used with any array-like type.

```js

//Define required behaviors, including can-connect-ndjson
const behaviors = [
    require("can-connect/data/url/url"),
    require("can-connect/constructor/constructor"),
    require("can-connect/can/map/map"),
    require("can-connect-ndjson") //require NDJSON behavior
];
```

#### 3.Create `can-connect` connection. Link `can-connect` to the model by
attaching a connection object. The connection object is created by calling
`connect` with the behaviors and options. You may need to pass an
NDJSON-specific endpoint option if the backend serves NDJSON from a different
URL.

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

#### 4. Use the `can-connect` methods on the model. `getList` now uses a
[`ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)
response behind the scenes. NDJSON lines read from the stream will be pushed
into the list instance as JavaScript objects.

```js
let todoListPromise = Todo.getList({});
```

The `todoListPromise` will return the list as soon as the streaming response
starts. At that time the list is usually empty since the response has just
begun. Afterwards, as JSON lines are streamed from the response, instances are
created from each line and added to the list, one at a time.

If the raw data is below, each `Todo` instance in the list will be one line
like this: `{desc:"first", complete: false}`

```js
//NDJSON raw data example
{"desc":"first", "complete": false}\n
{"desc":"second", "complete": false}\n
{"desc":"third", "complete": false}\n
{"desc":"fourth", "complete": true}\n
```

#### 5. Use the model with a template. Use `can-stache` or your favorite
template language to attach your data to the DOM.

```js
const stache = require("can-stache");

const template = stache("<ul>{{#each todos}}<li>{{name}}</li>{{/each}}</ul>");

todoListPromise.then(function(list) {
    document.body.append(template({todos: list);
});
```

#### All together

We use our `ndjsonStream` behavior to enable our model to work seamlessly with
a stream of NDJSON, which it will parse into an array of JS objects.

Note: that you must pass the `ndjsonStream` behavior. If no NDJSON endpoint is
passed, it will default to the `url`.

```js
const connect = require("can-connect");
const DefineList = require("can-define/list/list");
const DefineMap = require("can-define/map/map");
const stache = require("can-stache");

//Define template
const template = stache("<ul>{{#each todos}}<li>{{name}}</li>{{/each}}</ul>");

// Define model
const Todo = DefineMap.extend("Todo", {id: "number", name: "string"}); 
Todo.List = DefineList.extend("TodoList", {"#": Todo});

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

let todoListPromise = Todo.getList({});

todoListPromise.then(function(list) {
    document.body.append(template({todos: list);
});
```

## Using `fetch` with NDJSON and `ReadableStreams` Learn about using the
[`fetch API`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) with
NDJSON and `ReadableStreams` [here]().

## Parsing a stream of NDJSON to a stream of JS Objects Learn about how we
parse the NDJSON stream into a ReadableStream of JS objects using
[can-ndjson-stream `can-ndjson-stream`].

## Creating an NDJSON service using Express Checkout the [this tutorial]() or
the [can-ndjson-stream#CreatinganNDJSONstreamservicewithNodeJS_
`can-ndjson-stream`] module documentation.
