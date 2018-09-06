import {MsgpackAdapter, CustomType} from "../src";
import {normalizations} from 'alpha-serializer';

describe('MsgpackAdapter', () => {
    describe('handling Date', () => {
        it('disabling msgpack timestamp enables Date normalization', () => {
            const adapter = new MsgpackAdapter({disableTimestampEncoding: true});

            expect(adapter.excludedNormalizations)
                .toEqual([]);
        });

        it('enabling msgpack timestamp disabled Date normalization', () => {
            expect((new MsgpackAdapter({disableTimestampEncoding: false})).excludedNormalizations)
                .toEqual([normalizations.DATE.name]);

            expect((new MsgpackAdapter()).excludedNormalizations)
                .toEqual([normalizations.DATE.name]);
        });
    });

    describe('registering custom types', () => {
        let adapter: MsgpackAdapter;

        class Foo {
            constructor(readonly value: number) {

            }
        }

        let customType: CustomType<Foo>;
        const FOO = new Foo(100);

        beforeEach(() => {
            adapter = new MsgpackAdapter({disableTimestampEncoding: true});

            customType = {
                type: 0x10,
                class: Foo,
                encode(value: Foo) {
                    const b = new Buffer(8);
                    b.writeDoubleBE(value.value, 0);
                    return b;
                },
                decode(value: Buffer) {
                    return new Foo(value.readDoubleBE(0));
                },
            };
        });

        it('registering custom type register that on msgpack as well', () => {
            adapter.registerCustomType(customType);
            expect(adapter.excludedNormalizations).toEqual([]);

            const serialized = adapter.serialize(FOO);
            const deserialized = adapter.deserialize(serialized);
            expect(serialized).toMatchSnapshot();
            expect(deserialized).toEqual(FOO);
            expect(deserialized).toBeInstanceOf(Foo);
        });

        it('registering custom types with normalization name disables it', () => {
            const normalizationName = 'test';
            adapter.registerCustomType({
                ...customType,
                normalizationName,
            });
            expect(adapter.excludedNormalizations).toEqual([normalizationName]);

            const serialized = adapter.serialize(FOO);
            const deserialized = adapter.deserialize(serialized);
            expect(serialized).toMatchSnapshot();
            expect(deserialized).toEqual(FOO);
            expect(deserialized).toBeInstanceOf(Foo);
        });
    });

    describe('serialization and deserialization', () => {
        let adapter: MsgpackAdapter;

        beforeEach(() => {
            adapter = new MsgpackAdapter();
        });

        it('primitives', () => {
            const values = [
                'string',
                null,
                1,
            ];

            values.forEach((value) => {
                const serialized = adapter.serialize(value);
                const deserialized = adapter.deserialize(serialized);

                expect(serialized).toMatchSnapshot();
                expect(deserialized).toEqual(value);
            });
        });

        it('simple object', () => {
            const object = {
                foo: 'bar',
                date: new Date(1536255046865),
                num: 1,
                null: null,
            };
            const serialized = adapter.serialize(object);
            const deserialized = adapter.deserialize(serialized);
            expect(serialized).toMatchSnapshot();
            expect(deserialized).toEqual(object);
        });

        it('with normalized value', () => {
            const object = {
                date: {
                    '@type': 'Date',
                    "value": 10000,
                },
            };

        });
    });
});
