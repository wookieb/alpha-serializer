import * as sinon from 'sinon';
import {DataNormalizer} from "alpha-serializer";
import {create} from '../src/create';

describe('create', () => {
    let normalizer: DataNormalizer;
    let serializer: ReturnType<typeof create>;
    let serialize: (value: any) => string;

    beforeEach(() => {
        normalizer = sinon.createStubInstance(DataNormalizer);
        serializer = create(normalizer);

        serialize = sinon.stub();
    });

    const P1 = 'p1';
    const P2 = 'p2';

    it('test', () => {
        (normalizer.hasNormalization as sinon.SinonStub)
            .withArgs(P1)
            .returns(true);

        (normalizer.hasNormalization as sinon.SinonStub)
            .withArgs(P2)
            .returns(false);

        expect(serializer.test(P1)).toBe(true);
        expect(serializer.test(P2)).toBe(false);
    });

    it('print', () => {
        const data = {some: 'data'};
        const serializedValue = 'serialized';
        (normalizer.normalize as sinon.SinonStub)
            .withArgs(P1)
            .returns(data);

        (serialize as sinon.SinonStub)
            .withArgs(data)
            .returns(serializedValue);

        expect(serializer.print(P1, serialize)).toBe(serializedValue);
    });
});