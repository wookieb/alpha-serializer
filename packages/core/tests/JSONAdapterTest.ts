import {assert} from 'chai';
import {JSONAdapter} from "../src/JSONAdapter";


describe('JSONAdapter', () => {

    let adapter: JSONAdapter;

    const DATA = {
        some: 'pseudo random',
        data: 1,
        to: 'serialize'
    };

    const DATA_AS_JSON = '{"some":"pseudo random","data":1,"to":"serialize"}';

    beforeEach(() => {
        adapter = new JSONAdapter();
    });

    it('serialize', () => {
        const result = adapter.serialize(DATA);

        assert.strictEqual(result, DATA_AS_JSON);
    });

    it('deserialize', () => {
        const result = adapter.deserialize(DATA_AS_JSON);

        assert.deepEqual(result, DATA);
    })
});