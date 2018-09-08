export class Normalization<T = any> {
    constructor(public readonly name: string,
                public readonly clazz: { new(...args: any[]): any },
                public readonly normalizer: NormalizerFunction<T>,
                public readonly denormalizer: DenormalizerFunction<T>) {
        Object.freeze(this);
    }
}

export type NormalizationInput = Partial<Pick<Normalization, 'name' | 'normalizer' | 'denormalizer'>>
    & Pick<Normalization, 'clazz'>;

export type NormalizerFunction<T = any> = (value: T) => any;
export type DenormalizerFunction<T = any> = (value: any) => T;