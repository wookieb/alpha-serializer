import {Serializable} from "./decorators/Serializable";
import {StandardNormalizer} from "./StandardNormalizer";
import * as normalizations from './normalizations';
import {Serializer} from "./Serializer";
import {JSONAdapter} from "./JSONAdapter";

export * from './DataNormalizer';
export * from './Normalization';
export * from './Serializer';
export * from './JSONAdapter';
export * from './normalizerFactory';
export * from './Adapter';
export * from './SerializerInterface';

export {Serializable, StandardNormalizer, normalizations};

export const normalizer = new StandardNormalizer();
Serializable.useDataNormalizer(normalizer);

export const serializer = new Serializer(new JSONAdapter(), normalizer);
export const serialize = serializer.serialize.bind(serializer);
export const deserialize = serializer.deserialize.bind(serializer);

export const registerNormalization = normalizer.registerNormalization.bind(normalizer);