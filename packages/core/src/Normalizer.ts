const supportsSymbol = typeof Symbol === 'function';

export const NORMALIZE = supportsSymbol ? Symbol('__normalize') : '__normalize';
export const DENORMALIZE = supportsSymbol ? Symbol('__denormalize') : '__denormalize';

export default class Normalizer {
    register(clazz: Function, options: ) {

    }

    deregister(clazz: Function) {

    }
}