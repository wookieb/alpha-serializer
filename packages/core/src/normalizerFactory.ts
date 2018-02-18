/**
 * A simple function that returns provided object.
 * Like a NO OP normalizer
 */
export function simpleNormalizer(object: any) {
    return object;
}

export function simpleDenormalizer(clazz: Function, data: any) {
    return Object.assign(Object.create(clazz.prototype), data);
}