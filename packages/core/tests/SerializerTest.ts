import {Serializer} from "../src/Serializer";
import {JSONAdapter} from "../src/JSONAdapter";
import {DataNormalizer, serialize} from "../src";
import {assert} from 'chai';
import * as sinon from 'sinon';

describe('Serializer', () => {
    const ADAPTER = new JSONAdapter();
    const NORMALIZER = new DataNormalizer();

    let adapter: JSONAdapter;
    let normalizer: DataNormalizer;

    let serializer: Serializer;

    const DATA = {some: 'data'};
    const NORMALIZED_DATA = {just: 'fake', normalized: 'data'};
    const SERIALIZATION_RESULT = 'serialization result';

    beforeEach(() => {
        adapter = sinon.createStubInstance(JSONAdapter);
        normalizer = sinon.createStubInstance(DataNormalizer);

        serializer = new Serializer(adapter, normalizer);
    });

    it('normalizer must be an instance of DataNormalizer', () => {
        assert.throws(() => {
            // tslint:disable-next-line: no-unused-expression
            new Serializer(ADAPTER, {} as any);
        }, /Must be undefined or an instance of DataNormalizer/);
    });

    it('adapter must look like adapter (serializer, deserialize methods)', () => {
        assert.throws(() => {
            // tslint:disable-next-line: no-unused-expression
            new Serializer({} as any, NORMALIZER);
        }, /Must be an object with properties: "serialize" \- a function, "deserialize" \- a function/);
    });

    it('serialization normalizes data first then serialize via adapter', () => {
        (normalizer.normalize as sinon.SinonStub).withArgs(DATA).returns(NORMALIZED_DATA);
        (adapter.serialize as sinon.SinonStub).withArgs(NORMALIZED_DATA).returns(SERIALIZATION_RESULT);

        assert.strictEqual(serializer.serialize(DATA), SERIALIZATION_RESULT);
    });

    it('deserialization deserialize data first then denormalize then', () => {
        const SERIALIZED = 'serialized';
        const DESERIALIZED = {some: 'data'};
        const RESULT = {just: 'fake', denormalized: 'data'};

        (adapter.deserialize as sinon.SinonStub).withArgs(SERIALIZED).returns(DESERIALIZED);
        (normalizer.denormalize as sinon.SinonStub).withArgs(DESERIALIZED).returns(RESULT);

        assert.strictEqual(serializer.deserialize(SERIALIZED), RESULT);
    });

    it('normalizer might be disabled', () => {
        serializer.normalizer = undefined;

        (adapter.serialize as sinon.SinonStub).withArgs(DATA).returns(SERIALIZATION_RESULT);
        (adapter.deserialize as sinon.SinonStub).withArgs(SERIALIZATION_RESULT).returns(DATA);

        assert.strictEqual(serializer.serialize(DATA), SERIALIZATION_RESULT);
        assert.strictEqual(serializer.deserialize(SERIALIZATION_RESULT), DATA);

        sinon.assert.notCalled(normalizer.normalize as sinon.SinonStub);
        sinon.assert.notCalled(normalizer.denormalize as sinon.SinonStub);
    });
});