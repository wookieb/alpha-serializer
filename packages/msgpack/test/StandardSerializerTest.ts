import StandardSerializer from "../src/StandardSerializer";
import {assert} from 'chai';

describe('StandardSerializer', () => {

    const serializer = new StandardSerializer();

    it('date', () => {
        const date = new Date();
        const result = serializer.deserialize(serializer.serialize(date));

        assert.instanceOf(result, Date);
        assert.strictEqual(result.getTime(), date.getTime());
    });
});