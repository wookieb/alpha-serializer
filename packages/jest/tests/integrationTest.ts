import {DataNormalizer} from "alpha-serializer";
import {create} from '../src/create';

describe('integration', () => {
    class CustomType {
        public val: number;

        constructor() {
            // let's have a random value inside to make default snapshot serializers fail
            this.val = Math.random();
        }
    }

    const normalizer = new DataNormalizer();
    normalizer.registerNormalization({
        clazz: CustomType,
        normalizer() {
            return 'custom-type';
        }
    });

    expect.addSnapshotSerializer(create(normalizer));

    it('sanity', () => {
        expect(new CustomType())
            .toMatchSnapshot();

        expect([
            new CustomType()
        ])
            .toMatchSnapshot();

        expect({
            some: 'prop',
            custom: new CustomType()
        })
            .toMatchSnapshot();
    });
});