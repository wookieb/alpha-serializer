import {assert} from 'chai';
import {DataNormalizer} from "../src/DataNormalizer";
import * as normalizations from '../src/normalizations';

describe('DataNormalizer', () => {
    let normalizer: DataNormalizer;


    beforeEach(() => {
        normalizer = new DataNormalizer();
        normalizer.registerNormalization(normalizations.MAP);
        normalizer.registerNormalization(normalizations.SET);
        normalizer.registerNormalization(normalizations.DATE);
    });

    describe('hasNormalization', () => {
        it('not for primitives', () => {
            assert.isFalse(normalizer.hasNormalization('string'));
            assert.isFalse(normalizer.hasNormalization(undefined));
            assert.isFalse(normalizer.hasNormalization(null));
            assert.isFalse(normalizer.hasNormalization(1));
        });

        it('not for arrays as functions', () => {
            assert.isFalse(normalizer.hasNormalization([]));
            assert.isFalse(normalizer.hasNormalization(Array.isArray));
        });

        it('true for registered normalizations', () => {
            assert.isTrue(normalizer.hasNormalization(new Map()));
            assert.isTrue(normalizer.hasNormalization(new Set()));
            assert.isTrue(normalizer.hasNormalization(new Date()));
        });

        it('false for objects without registered normalization', () => {
            class Foo {}

            assert.isFalse(normalizer.hasNormalization(new Foo()));
            assert.isFalse(normalizer.hasNormalization({}));
        })
    });

    describe('normalization', () => {
        it('primitives', () => {

            assert.strictEqual(normalizer.normalize(1), 1);
            assert.strictEqual(normalizer.normalize('test'), 'test');
            assert.strictEqual(normalizer.normalize(null), null);
            assert.strictEqual(normalizer.normalize(undefined), undefined);
            assert.strictEqual(normalizer.normalize(true), true);
        });

        it('functions always return undefined', () => {
            assert.strictEqual(normalizer.normalize(Array.prototype.map), undefined);
        });

        it('null', () => {
            assert.strictEqual(normalizer.normalize(null), null);
        });

        it('normalization of custom types', () => {
            const mapData: [number, string][] = [[1, 'test'], [2, 'foo'], [3, 'bar']];
            const map = new Map<any, any>(mapData);

            assert.deepEqual(normalizer.normalize(map), {
                '@type': 'Map',
                value: mapData
            });
        });

        it('normalization of frozen objects', () => {
            const mapData: [string, number][] = [['key', 2], ['key2', 4]];
            const data = {prop: new Map(mapData)};

            Object.freeze(data);

            assert.deepEqual(normalizer.normalize(data), {
                prop: {
                    '@type': 'Map',
                    value: mapData
                }
            })
        });

        it('normalization of simple objects', () => {
            const data = {
                prop1: 100,
                prop2: 'some random string',
                prop3: true,
                prop4: undefined,
                prop5: null
            };

            assert.deepEqual(normalizer.normalize(data), data);
        });

        it('arrays', () => {
            const data = [
                new Date(4000),
                new Date(2000),
                new Date(10000)
            ];

            assert.deepEqual(normalizer.normalize(data), [
                {'@type': 'Date', value: '1970-01-01T00:00:04.000Z'},
                {'@type': 'Date', value: '1970-01-01T00:00:02.000Z'},
                {'@type': 'Date', value: '1970-01-01T00:00:10.000Z'},
            ])
        });

        it('simple arrays', () => {
            const data = [1, 2, 'string', undefined, true, null];

            assert.deepEqual(normalizer.normalize(data), data);
        });
    });

    describe('denormalization', () => {
        it('primitives', () => {
            assert.strictEqual(normalizer.denormalize(1), 1);
            assert.strictEqual(normalizer.denormalize('test'), 'test');
            assert.strictEqual(normalizer.denormalize(null), null);
            assert.strictEqual(normalizer.denormalize(undefined), undefined);
            assert.strictEqual(normalizer.denormalize(true), true);
        });

        it('maps', () => {
            const data = {
                '@type': 'Map',
                value: [
                    ['key', 'value'],
                    ['key1', 'value1'],
                    ['key2', 'value2']
                ]
            };

            const result = normalizer.denormalize(data);

            const map = new Map(<[string, string][]>data.value);
            assert.instanceOf(result, Map);
            assert.sameDeepMembers(Array.from(result.entries()), Array.from(map.entries()));
        });

        it('objects', () => {
            const data = {
                prop: 1,
                prop2: {
                    '@type': 'Map',
                    value: [
                        ['key1', 'value1'],
                        ['key2', 'value2']
                    ]
                },
                prop3: {
                    '@type': 'Set',
                    value: [
                        {'@type': 'Date', value: '1970-01-01T00:00:02.000Z'},
                        {'@type': 'Date', value: '1970-01-01T00:00:03.000Z'}
                    ]
                }
            };

            const result = normalizer.denormalize(data);

            assert.instanceOf(result.prop2, Map);
            assert.instanceOf(result.prop3, Set);

            assert.deepEqual(result, {
                prop: 1,
                prop2: new Map([
                    ['key1', 'value1'],
                    ['key2', 'value2']
                ]),
                prop3: new Set([
                    new Date(2000),
                    new Date(3000)
                ])
            });
        });

        it('null', () => {
            assert.strictEqual(normalizer.denormalize(null), null);
        });

        it('throws an error if normalization for given types is missing', () => {
            assert.throws(() => {
                normalizer.denormalize({'@type': 'SomeRandomType', value: 'kek'});
            }, 'Missing normalization for type SomeRandomType')
        })
    });
});