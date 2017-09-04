import {AdapterInterface} from "./Adapter";
import Normalizer from "./Normalizer";

export default class Serializer<T> {
    constructor(private adapter: AdapterInterface<T>, private normalizer: Normalizer) {

    }

    serialize(object: any): T {
        const normalized = this.normalizer.normalize(object, this.adapter.ignoredNormalizations);
        return this.adapter.serialize(object);
    }

    deserialize(data: T): any {
        const deserialized = this.adapter.deserialize(data);
        return this.normalizer.denormalize(deserialized);
    }
}