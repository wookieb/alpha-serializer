export interface Adapter<T = any> {
    serialize(data: any): T;

    deserialize(data: T): any;
}