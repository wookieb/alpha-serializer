import {DenormalizerFunction, Normalization, NormalizerFunction} from "../Normalization";
import {DataNormalizer} from "../DataNormalizer";
import {simpleDenormalizer, simpleNormalizer} from "../normalizerFactory";

export interface SerializableOptions {
    name?: string;
    normalizer?: NormalizerFunction,
    denormalizer?: DenormalizerFunction
}

export interface SerializableType {
    (options?: SerializableOptions): ClassDecorator,

    useDataNormalizer(normalizer: DataNormalizer): void;

    _dataNormalizer: DataNormalizer;
}

export const Serializable = <SerializableType>function (options: SerializableOptions = {}) {
    return function (target: Function) {
        const normalization = new Normalization(
            (options && options.name) || target.name,
            target,
            (options && options.normalizer) ? options.normalizer : simpleNormalizer,
            (options && options.denormalizer) ? options.denormalizer : simpleDenormalizer.bind(null, target)
        );
        Serializable._dataNormalizer.registerNormalization(normalization)
    }
};

Serializable.useDataNormalizer = function (normalizer: DataNormalizer) {
    Serializable._dataNormalizer = normalizer;
};