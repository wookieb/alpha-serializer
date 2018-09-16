import {DataNormalizer} from "./DataNormalizer";
import {Adapter} from "./Adapter";
import * as is from 'predicates';

export class Serializer<TTarget = any> {
    // tslint:disable-next-line: variable-name
    private _normalizer: DataNormalizer;

    // tslint:disable-next-line: variable-name
    private _adapter: Adapter;

    constructor(adapter: Adapter<TTarget>, normalizer?: DataNormalizer) {
        this.normalizer = normalizer;
        this.adapter = adapter;
    }

    set normalizer(normalizer: DataNormalizer) {
        is.assert(is.undefinedOr(is.instanceOf(DataNormalizer)))(normalizer);
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

    public serialize(data: any): TTarget {
        return this.adapter.serialize(this.normalizer ? this.normalizer.normalize(data) : data);
    }

    public deserialize(data: TTarget) {
        const deserialized = this.adapter.deserialize(data);

        return this.normalizer ? this.normalizer.denormalize(deserialized) : deserialized;
    }
}