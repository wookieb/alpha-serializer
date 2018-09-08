# alpha-serializer-msgpack
[![CircleCI](https://circleci.com/gh/wookieb/alpha-serializer/tree/master.svg?style=svg)](https://circleci.com/gh/wookieb/alpha-serializer/tree/master) [![Coverage Status](https://coveralls.io/repos/github/wookieb/alpha-serializer/badge.svg?branch=master)](https://coveralls.io/github/wookieb/alpha-serializer?branch=master)

Msgpack adapter for [alpha-serializer](https://github.com/wookieb/alpha-serializer/tree/master/packages/core).

## Install
```javascript
npm install --save alpha-serializer-msgpack
```

## Usage
Setting adapter in global serializer
```javascript
const {MsgpackAdapter} = require('alpha-serializer-msgpack');
const {serializer} = require('alpha-serializer');

serializer.adapter = new MsgpackAdapter();
```

Using adapter in new serializer instance
```javascript
const {MsgpackAdapter} = require('alpha-serializer-msgpack');
const {Serializer, normalizer} = require('alpha-serializer');

const serializer = new Serializer(normalizer, new MsgpackAdapter);
```

