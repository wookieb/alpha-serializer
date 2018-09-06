export interface Adapter<T = any> {

    readonly excludedNormalizations?: string[];
    serialize(data: any): T;

    deserialize(data: T): any;
}