# Serializer

Serializer is an object that wraps normalizer and adapter together.

Using global serializer
```javascript
const {serializer} = require('alpha-serializer');

const s = serializer.serialize(new Date(1000));
serializer.deserialize(s);
```

Using aliases
```javascript
const {serialize, deserialize} = require('alpha-serializer');

// serialize is an alias to serializer.serialize
const s = serialize(new Date(1000));

// deserialize is an alias to serializer.deserialize
deserialize(s);
```

## Reconfiguring serializer

Changing adapter
```javascript

const {serializer} = require('alpha-serializer');

serializer.adapter = new CustomAdapter();
```

Changing normalizer
```javascript
const {serializer, DataNormalizer} = require('alpha-serializer');

const normalizer = new DataNormalizer();
// register your own normalizations here

serializer.normalizer = normalizer;
```

## Your own instance of serializer
If you really need it you can easily create your own instance of serializer and share among components, objects.
```javascript
const {Serializer, normalizer, JSONAdapter} = require('alpha-serializer');

const serializer = new Serializer(new JSONAdapter, normalizer);
```