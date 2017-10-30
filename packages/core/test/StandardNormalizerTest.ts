import {assert} from 'chai';
import StandardNormalizer from "../src/StandardNormalizer";
import * as faker from 'faker'

describe('StandardNormalizer', () => {
    let normalizer = new StandardNormalizer();

    function normalizeAndDenormalize<T>(data: T): T {
        const normalized = JSON.parse(JSON.stringify(normalizer.normalize(data)));
        return normalizer.denormalize(normalized);
    }

    it('Date', () => {
        const date = faker.date.past(5);

        const result = normalizeAndDenormalize(date);
        assert.instanceOf(result, Date);
        assert.strictEqual(result.toISOString(), date.toISOString());
    });

    describe('Map', () => {
        it('simple map', () => {
            const map = new Map();
            map.set(faker.random.alphaNumeric(5), faker.random.number(1000));
            map.set(faker.random.alphaNumeric(4), faker.address.city());
            map.set({some: 'object'}, faker.random.boolean());

            const result = normalizeAndDenormalize(map);

            assert.instanceOf(map, Map);
            assert.sameDeepMembers(Array.from(result), Array.from(map));
        });

        it('map with normalizable types', () => {
            const map = new Map();

            const nestedMap = new Map();
            nestedMap.set(faker.random.alphaNumeric(20), faker.lorem.word());
            nestedMap.set(faker.random.alphaNumeric(20), faker.lorem.word());

            map.set('date_key', faker.date.past(10));
            map.set('nested_map', nestedMap);

            const result = normalizeAndDenormalize(map);
            assert.instanceOf(result, Map);
            assert.instanceOf(result.get('date_key'), Date);
            assert.instanceOf(result.get('nested_map'), Map);
            assert.strictEqual(result.get('date_key').toISOString(), map.get('date_key').toISOString());
            assert.sameDeepMembers(Array.from(result), Array.from(map));
        });
    });

    describe('Set', () => {
        it('simple set', () => {
            const set = new Set();
            set.add(faker.lorem.word());
            set.add(faker.lorem.paragraph());
            set.add(faker.random.number(1000));

            const result = normalizeAndDenormalize(set);
            assert.instanceOf(result, Set);
            assert.sameDeepMembers(Array.from(result), Array.from(set));
        });

        it('set with normalizable types', () => {
            const set = new Set();
            const map = new Map();
            map.set(faker.random.alphaNumeric(10), faker.random.words());
            map.set(faker.random.alphaNumeric(10), faker.random.words());
            map.set(faker.random.alphaNumeric(10), faker.random.words());

            const date = faker.date.recent(10);
            set.add(date);
            set.add(map);

            const result = normalizeAndDenormalize(set);

            assert.instanceOf(result, Set);
            assert.instanceOf(Array.from(result)[0], Date);
            assert.instanceOf(Array.from(result)[1], Map);

            assert.sameDeepMembers(Array.from(result), Array.from(set));
        });
    });
});