# alpha-serializer-jest

Snapshot serializer for _jest_ test runner.

## Install
```bash 
npm install --save alpha-serializer-jest
``` 

## Usage
Via global config
```
{
    ...
    "jest": {
        "snapshot-serializers": ["alpha-serializer-jest"]
    }
}
```

In your tests code
```typescript
const snapshotSerializer = require('alpha-serializer-jest');

expect.addSnapshotSerializer(snapshotSerializer);

// with custom normalizer
const {create} = require('alpha-serializer-jest');

expect.addSnapshotSerializer(create(normalizer));
```