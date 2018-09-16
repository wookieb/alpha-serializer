# Alpha-serializer
[![CircleCI](https://circleci.com/gh/wookieb/alpha-serializer/tree/master.svg?style=svg)](https://circleci.com/gh/wookieb/alpha-serializer/tree/master) [![Coverage Status](https://coveralls.io/repos/github/wookieb/alpha-serializer/badge.svg?branch=master)](https://coveralls.io/github/wookieb/alpha-serializer?branch=master)

* Serializer with support for multiple serialization formats
* Allows symmetric serialization
* Support serialization of custom types
* Properly serializes Map, Set and Date (more in future)

## Install
```
npm install --save alpha-serializer
```

## Usage with global functions

Simples possible example
```javascript
const {serialize, deserialize} = require('alpha-serializer');

const object = {
    map: new Map([['key', 'value']]),
    set: new Set(['value1', 'value2']),
    date: new Date(),
    foo: 'bar'
};

const serialized = serialize(object);
// send serialized data to the browser or somewhere else

const result = deserialize(object);

result.map instanceof Map; // true
result.set instanceof Set; // true
result.date instanceof Date; // true
result.foo; // 'bar'


const {Serializable, registerNormalization} = require('alpha-serializer');
@Serializable()
class Foo {
    
}

// same as above
registerNormalization({clazz: Foo});
```

## Usage as object

Using global object
```javascript
const {serializer} = require('alpha-serializer');

const s = serializer.serialize(new Date());
serializer.deserialize(s);
```

## Use cases
_alpha-serializer_ is particularly usefull when you need to serialize:
* Simple errors or errors with special properties
* Value objects (for example ObjectId, Money or Date)
* Maps, sets and other data structures

## More

* [Serializer](./docs/serializer.md)
* [Normalizations](./docs/normalizations.md)
* [Adapters](./docs/adapters.md)
* [Integration with jest](../jest)