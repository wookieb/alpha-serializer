import Normalizer from "./Normalizer";

export type NormalizationRef = Function | string;

export interface AdapterInterface<T> {
    serialize(object: any, normalizer: Normalizer): T;

    deserialize(data: T, normalizer: Normalizer): any;
}