import {AdapterInterface} from "./Adapter";
import Normalizer from "./Normalizer";

export default class Serializer<T> {
    serialize(object: any): T {
        return this.adapter.serialize(object, this.normalizer);
    }

    deserialize(data: T): any {
        const deserialized = this.adapter.deserialize(data);
        return this.normalizer.denormalize(deserialized);
    }
}