import * as normalizations from '../src/normalizations';
import {assert} from 'chai';

describe('normalizations', () => {
    describe('Map', () => {
        const normalization = normalizations.MAP;
        const map = new Map([['key', 'value'], ['another', 'key'], ['and another', 'value']]);

        it('normalization', () => {
            assert.sameDeepOrderedMembers(normalization.normalizer(map), Array.from(map));
        });

        it('denormalization', () => {
            const data = JSON.parse(
                JSON.stringify(
                    normalization.normalizer(map)
                )
            );

            const result = normalization.denormalizer(data);
            assert.instanceOf(result, Map);
            assert.sameDeepOrderedMembers(
                Array.from(result),
                Array.from(map)
            );
        });
    });

    describe('Set', () => {
        const normalization = normalizations.SET;
        const set = new Set(['some', 'value', 'with', ' something', 'extra']);

        it('normalization', () => {
            assert.sameDeepOrderedMembers(normalization.normalizer(set), Array.from(set));
        });

        it('denormalization', () => {
            const data = JSON.parse(
                JSON.stringify(
                    normalization.normalizer(set)
                )
            );

            const result = normalization.denormalizer(data);
            assert.instanceOf(result, Set);
            assert.sameDeepOrderedMembers(
                Array.from(result),
                Array.from(set)
            );
        });
    });

    describe('Date', () => {
        const normalization = normalizations.DATE;
        const date = new Date();

        it('normalization', () => {
            assert.strictEqual(normalization.normalizer(date), date.toISOString());
        });

        it('denormalization', () => {
            const result = normalization.denormalizer(
                JSON.parse(
                    JSON.stringify(normalization.normalizer(date))
                )
            );

            assert.instanceOf(result, Date);
            assert.strictEqual(result.getTime(), date.getTime());
        })
    })
});