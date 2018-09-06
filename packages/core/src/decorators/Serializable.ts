import {DenormalizerFunction, Normalization, NormalizerFunction} from "../Normalization";
import {DataNormalizer} from "../DataNormalizer";
import {simpleDenormalizer, simpleNormalizer} from "../normalizerFactory";

export interface SerializableOptions {
    name?: string;
    normalizer?: NormalizerFunction;
    denormalizer?: DenormalizerFunction;
}

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
            (options && options.normalizer) ? options.normalizer : simpleNormalizer,
            (options && options.denormalizer) ? options.denormalizer : simpleDenormalizer.bind(null, target),
        );
        Serializable._dataNormalizer.registerNormalization(normalization);
    };
} as SerializableType;

Serializable.useDataNormalizer = function (normalizer: DataNormalizer) {
    Serializable._dataNormalizer = normalizer;
};