import * as index from '../src/';
import {assert} from 'chai';
import {Serializer} from "../src/Serializer";

describe('index', () => {
    it('global serializer', () => {
        assert.instanceOf(index.serializer, Serializer);
    });
});