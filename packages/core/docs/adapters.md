# Adapters

Adapter is an object responsible for changing normalized value to final serialization format.

Currently _alpha-serializer_ supports following adapters:
- JSONAdapter 
- MsgpackAdapter (in alpha-serializer-msgpack package)

## Excluding normalizations

Sometimes adapters can handle some objects better than normalizer. For example `Date` in msgpack is much shorter so don't need to be normalized. For that purpose Adapter contain `excludedNormalizations` property which is an array of string with normalization names that should be disabled.