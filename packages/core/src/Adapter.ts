export type NormalizationRef = Function | string;

export interface AdapterInterface<T> {
    serialize(object: any): T;

    deserialize(data: T): any;

    /**
     *  List of normalizations that should be ignored in normalizer as adapter knows better way of handling it
     */
    ignoredNormalizations: NormalizationRef[];
}