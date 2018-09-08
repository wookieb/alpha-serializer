import {Normalization, NormalizationInput} from "../Normalization";
import {DataNormalizer} from "../DataNormalizer";

export type SerializableOptions = Pick<NormalizationInput, 'name' | 'normalizer' | 'denormalizer'>;

export interface SerializableType {
    (options?: SerializableOptions): ClassDecorator;

    _dataNormalizer: DataNormalizer;

    useDataNormalizer(normalizer: DataNormalizer): void;
}

export const Serializable = function (options: SerializableOptions = {}) {
    return function (target: { new(...args: any[]): any }) {
        const normalization = new Normalization(
            (options && options.name) || target.name,
            target,
            options.normalizer,
            options.denormalizer
        );
        Serializable._dataNormalizer.registerNormalization(normalization);
    };
} as SerializableType;

Serializable.useDataNormalizer = function (normalizer: DataNormalizer) {
    Serializable._dataNormalizer = normalizer;
};