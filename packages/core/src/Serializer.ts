import {DataNormalizer} from "./DataNormalizer";
import {Adapter} from "./Adapter";
import * as is from 'predicates';

export class Serializer<T = any> {
    // tslint:disable-next-line: variable-name
    private _normalizer: DataNormalizer;

    // tslint:disable-next-line: variable-name
    private _adapter: Adapter;

    constructor(normalizer: DataNormalizer, adapter: Adapter<T>) {
        this.normalizer = normalizer;
        this.adapter = adapter;
    }

    set normalizer(normalizer: DataNormalizer) {
        is.assert(is.instanceOf(DataNormalizer))(normalizer);
        this._normalizer = normalizer;
    }

    get normalizer() {
        return this._normalizer;
    }

    set adapter(adapter: Adapter) {
        is.assert(is.struct({
            serialize: is.func,
            deserialize: is.func,
        }))(adapter);

        this._adapter = adapter;
    }

    get adapter() {
        return this._adapter;
    }

    public serialize(data: any): T {
        return this.adapter.serialize(this.normalizer.normalize(data));
    }

    public deserialize(data: T) {
        return this.normalizer.denormalize(this.adapter.deserialize(data));
    }
}