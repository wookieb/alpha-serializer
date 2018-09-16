# Normalizations

Normalization is a process that changes the original object to something that is serializable by the adapter.
Denormalization from the other side tries to create the original object and populates it with a value.

By default _alpha-serializer_ has defined normalization for following types:
- Date
- Map
- Set

_alpha-serializer_ has `DataNormalizer` class that is responsible for aggregating all normalizations and applying them on values that are about to be serialized.

## Simplest normalization
```javascript
const {registerNormalization, Serializable} = require('alpha-serializer');

@Serializable() // you can customize "name" as well, by default class name is used
class Foo {
    
}

// same as 
registerNormalization({clazz: Foo});
```

This normalization simply tells that all objects of instance `Foo` should be normalized.

Example result of normalization:
```javascript
const {serialize} = require('alpha-serializer');

const object = new Foo();
object.num = 1,
object.foo = 'bar';

const serialized = serialize(object);
// '{"@type": "Foo", "value": {"num": 1, "foo": "bar"}}'
```

Thanks to extra `@type` property, the normalizer knows which normalization should be used in order to restore the original object
```javascript
const {deserialize} = require('alpha-serializer');
const result = deseralize(serialized);

result instanceof Foo; // true
result.num; // 1
result.foo; // 'bar'
```

## Custom normalization

Obviously normalization process can be fully customized. If you don't do it then _alpha-serializer_ uses default normalizer and denormalizer.

Default normalizer simply returns the original object. For most serialization formats only enumerable properties are visible in the final result.

Default denormalizer creates an instance of given class and assigns all properties to it.

Customizing normalization
```javascript
const {Serializable, serialize, deserialize} = require('alpha-serializer');


@Serializable({
    normalize(money) {
        return money.toString();
    },
    denormalize(value) {
        const [amount, currency] = value.split(' ');
        return new Money(parseInt(amount, 10) * 100, currency);
    }
})
class Money {
    constructor(amount, currency) {
        this.amount = amount;
        this.currency = currency;
    }
    
    toString() {
        return (this.amount / 100) + ' ' + this.currency;
    }
}

const serialized = serialize(new Money(100, 'EUR'));
// "{"@type": "Money", "value": "1 EUR"}"

const result = deserialize(serialized);

result instanceof Money; // true
result.amount; // 100
result.currency; // EUR
```

## Disabling normalization
If you really don't need normalization (for example because the adapter is able to handle all your custom types) you can disabled it.
```typescript
import {serializer, Serializer, JSONAdapter} from 'alpha-serializer';
// disabling on global serializer

serializer.normalizer = undefined;

// disabling in local serializer
const newSerializer = new Serializer(new JSONAdapter); // just omit last argument
```