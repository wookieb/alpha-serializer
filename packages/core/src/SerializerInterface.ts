export interface SerializerInterface<T> {
    serialize(data: any): T;

    deserialize(data: T): any;
}