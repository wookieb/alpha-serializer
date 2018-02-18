import {StandardNormalizer} from "../src/StandardNormalizer";
import {assert} from 'chai';
import {DataNormalizer} from "../src/DataNormalizer";
import * as normalizations from '../src/normalizations';

describe('StandardNormalizer', () => {
    it('contains predefined normalizations', () => {
        const normalizer = new StandardNormalizer();

        assert.instanceOf(normalizer, DataNormalizer);
        assert.strictEqual(normalizer.getNormalization('Map'), normalizations.MAP);
        assert.strictEqual(normalizer.getNormalization('Set'), normalizations.SET);
        assert.strictEqual(normalizer.getNormalization('Date'), normalizations.DATE);
    });
});