import {DataNormalizer} from "../../src/DataNormalizer";
import {Serializable} from "../../src/decorators/Serializable";
import {assert} from 'chai';
import {Normalization} from "../../src/Normalization";

describe('Serializable', () => {
    let normalizer: DataNormalizer;

    function assertNormalization(name: string) {
        const normalization = normalizer.getNormalization(name);
        assert.ok(normalization, `There is no normalization for name ${name}`);
        assert.instanceOf(normalization, Normalization);
        return normalization;
    }

    beforeEach(() => {
        normalizer = new DataNormalizer();
        Serializable.useDataNormalizer(normalizer);
    });

    it('simple auto serialization', () => {
        @Serializable()
        class SimpleClass {

        }

        const normalization = assertNormalization('SimpleClass');

        const obj = new SimpleClass();
        obj.prop = '1';
        obj.prop2 = 3;

        const normalized = normalization.normalizer(obj);
        const denormalized = normalization.denormalizer(
            JSON.parse(
                JSON.stringify(normalized),
            ),
        );
        assert.instanceOf(denormalized, SimpleClass);
        assert.propertyVal(denormalized, 'prop', '1');
        assert.propertyVal(denormalized, 'prop2', 3);
    });

    it('using different name', () => {
        const NAME = 'namespace/simple';

        @Serializable({name: NAME})
        class SimpleClass {

        }

        assertNormalization(NAME);
    });

    it('using custom normalizer', () => {
        @Serializable({
            normalizer(data: SimpleClass) {
                return {mainProperty: data.mainProperty / 2};
            },
        })

        class SimpleClass {
            constructor(public readonly mainProperty: number) {

            }
        }

        const normalization = assertNormalization('SimpleClass');

        const obj = new SimpleClass(4);

        const normalized = normalization.normalizer(obj);
        const denormalized = normalization.denormalizer(
            JSON.parse(
                JSON.stringify(normalized),
            ),
        );
        assert.instanceOf(denormalized, SimpleClass);
        assert.propertyVal(denormalized, 'mainProperty', 2);
    });

    it('using custom denormalizer', () => {
        @Serializable({
            denormalizer(data: any) {
                return new SimpleClass(data.mainProperty * 2);
            },
        })
        class SimpleClass {
            constructor(public readonly mainProperty: number) {

            }
        }

        const normalization = assertNormalization('SimpleClass');

        const obj = new SimpleClass(4);

        const normalized = normalization.normalizer(obj);
        const denormalized = normalization.denormalizer(
            JSON.parse(
                JSON.stringify(normalized),
            ),
        );
        assert.instanceOf(denormalized, SimpleClass);
        assert.propertyVal(denormalized, 'mainProperty', 8);
    });

    it('full configuration', () => {
        const NAME = 'someRandomName';

        @Serializable({
            name: NAME,
            normalizer(data: SimpleClass) {
                return data.mainProperty / 2;
            },
            denormalizer(data: number) {
                return new SimpleClass(data * 4);
            },
        })
        class SimpleClass {
            constructor(public readonly mainProperty: number) {

            }
        }

        const normalization = assertNormalization(NAME);

        const obj = new SimpleClass(4);

        const normalized = normalization.normalizer(obj);
        const denormalized = normalization.denormalizer(
            JSON.parse(
                JSON.stringify(normalized),
            ),
        );
        assert.instanceOf(denormalized, SimpleClass);
        assert.propertyVal(denormalized, 'mainProperty', 8);
    });
});