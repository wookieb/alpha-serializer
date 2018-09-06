import {Serializer, globalNormalizer} from 'alpha-serializer';
import {MsgpackAdapter} from "../src";
import each from 'jest-each';

describe('integration', () => {

    const values = [
        [new Map<string, any>([['key', new Date(1000)], ['key2', 100], ['key3', null]])],
        [new Set<any>([new Date(1001), 'string', null, 1000])],
        [new Date(1010)],
        [{
            foo: 'bar',
            prop: 1,
            date: new Date(1002),
        }],
        [[new Date(1003), 'foo', 'bar', null, 100]],
    ];

    function createTest(serializer: Serializer) {
        return (value: any) => {
            const serialized = serializer.serialize(value);
            const deserialized = serializer.deserialize(serialized);

            expect(serialized).toMatchSnapshot();
            expect(deserialized).toEqual(value);
        };
    }

    describe('simple adapter', () => {
        const serializer = new Serializer(globalNormalizer, new MsgpackAdapter());
        each(values).test('case %p', createTest(serializer));
    });

    describe('adapter without timestamp encoding', () => {
        const serializer = new Serializer(globalNormalizer, new MsgpackAdapter({
            disableTimestampEncoding: true,
        }));
        each(values).test('case %p', createTest(serializer));
    });
});
