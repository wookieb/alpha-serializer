import {Serializable} from "./decorators/Serializable";
import {StandardNormalizer} from "./StandardNormalizer";
import * as normalizations from './normalizations';
import {Serializer} from "./Serializer";
import {JSONAdapter} from "./JSONAdapter";

export const globalNormalizer = new StandardNormalizer();

Serializable.useDataNormalizer(globalNormalizer);

export * from './DataNormalizer';
export * from './Normalization';


export {Serializable, StandardNormalizer, normalizations};

export const serializer = new Serializer(globalNormalizer, new JSONAdapter());
export const serialize = serializer.serialize.bind(serializer);
export const deserialize = serializer.deserialize.bind(serializer);