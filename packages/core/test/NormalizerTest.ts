import {assert} from 'chai';
import Normalizer, {NORMALIZED_TYPE_KEY} from "../src/Normalizer";
import * as faker from 'faker';

class ExampleClass {
    prop: string;

    date: Date;
    constructorCalled: boolean;

    constructor() {
        Object.defineProperty(this, 'constructorCalled', {
            value: true,
            enumerable: false
        });
    }
}

function registerDateNormalizer(normalizer: Normalizer) {
    normalizer.register(Date, 'Date', {
        normalizer(d: Date) {
            return d.toISOString();
        },
        denormalizer(data: string) {
            return new Date(data);
        }
    });
}

describe('Normalizer', () => {
    let normalizer: Normalizer;

    beforeEach(() => {
        normalizer = new Normalizer();
    });

    it('name is inferred from clazz', () => {
        normalizer.register(ExampleClass, {
            normalizer: o => o,
            denormalizer: o => o
        });
        assert.strictEqual(normalizer.normalize(new ExampleClass)[NORMALIZED_TYPE_KEY], 'ExampleClass');
    });

    it('normalizer is optional and returns the same object by default', () => {
        normalizer.register(ExampleClass, 'ExampleClass');
        const object = new ExampleClass();
        object.prop = faker.random.alphaNumeric();

        assert.deepEqual(normalizer.normalize(object), {
            [NORMALIZED_TYPE_KEY]: 'ExampleClass',
            value: {prop: object.prop}
        });
    });

    it('uses normalizer if defined', () => {
        normalizer.register(ExampleClass, 'ExampleClass', {
            normalizer: (o: any) => {
                return {someProp: o.prop}
            }
        });
        const object = new ExampleClass();
        object.prop = faker.random.alphaNumeric();

        assert.deepEqual(normalizer.normalize(object), {
            [NORMALIZED_TYPE_KEY]: 'ExampleClass',
            value: {someProp: object.prop}
        });
    });

    it('denormalizer is optional - new instance without calling constructor and assigning properties', () => {
        normalizer.register(ExampleClass, 'ExampleClass');

        const normalized = {
            [NORMALIZED_TYPE_KEY]: 'ExampleClass',
            value: {
                prop1: faker.random.alphaNumeric(),
                prop2: faker.random.alphaNumeric()
            }
        };

        const result = normalizer.denormalize(normalized);
        assert.instanceOf(result, ExampleClass);
        assert.deepEqual(result, normalized.value);
        assert.isUndefined(result.constructorCalled);
    });

    it('uses denormalizer if defined', () => {
        normalizer.register(ExampleClass, 'ExampleClass', {
            denormalizer: (data) => {
                const o = new ExampleClass()
                o.prop = data.prop;
                return o;
            }
        });

        const normalized = {
            [NORMALIZED_TYPE_KEY]: 'ExampleClass',
            value: {
                prop: faker.random.alphaNumeric(10)
            }
        };

        const result = normalizer.denormalize(normalized);
        assert.instanceOf(result, ExampleClass);
        assert.deepEqual(result, normalized.value);
        assert.isTrue(result.constructorCalled);
    });

    it('nested custom normalization', () => {
        normalizer.register(ExampleClass, 'ExampleClass', {
            normalizer(data: ExampleClass) {
                return {...data};
            }
        });

        registerDateNormalizer(normalizer);

        const object = new ExampleClass();
        object.date = new Date();
        object.prop = faker.random.alphaNumeric(10);

        const normalized = JSON.parse(JSON.stringify(normalizer.normalize(object)));
        const result = normalizer.denormalize(normalized);

        assert.instanceOf(result, ExampleClass);
        assert.instanceOf(result.date, Date);
        assert.deepEqual(result, object);
        assert.strictEqual(result.date.toISOString(), object.date.toISOString());
    });

    it('normalizing frozen objects', () => {
        const object = new ExampleClass();
        object.prop = faker.random.alphaNumeric(10);
        object.date = new Date();

        Object.freeze(object);

        const result = JSON.parse(JSON.stringify(normalizer.normalize(object)));
        assert.deepEqual(result, {
            [NORMALIZED_TYPE_KEY]: 'ExampleClass',
            value: {
                prop: object.prop,
                date: {
                    [NORMALIZED_TYPE_KEY]: 'Date',
                    value: object.date.toISOString()
                }
            }
        });
    });
});