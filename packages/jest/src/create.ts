import {DataNormalizer} from "alpha-serializer";

export function create(normalizer: DataNormalizer) {
    return {
        test(val: any) {
            return normalizer.hasNormalization(val);
        },
        print(val: any, serialize: (val: any) => string) {
            return serialize(normalizer.normalize(val));
        }
    };
}
