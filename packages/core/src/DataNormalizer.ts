import {Normalization} from "./Normalization";
import * as is from 'predicates';

export const NORMALIZED_TYPE_KEY = '@type';

export class DataNormalizer {
    private nameToNormalization: Map<string, Normalization> = new Map();
    private clazzToNormalization: Map<Function, Normalization> = new Map();

    registerNormalization(normalization: Normalization) {
        this.nameToNormalization.set(normalization.name, normalization);
        this.clazzToNormalization.set(normalization.clazz, normalization);
    }

    getNormalization(name: string) {
        return this.nameToNormalization.get(name);
    }

    normalize(data: any): any {
        if (is.primitive(data)) {
            return data;
        }

        if (is.function(data)) {
            return;
        }

        if (is.array(data)) {
            return Array.prototype.map.call(data, this.normalize, this);
        }

        const normalization = this.getNormalizationForObject(data);

        if (normalization) {
            const normalized = normalization.normalizer(data);
            return {
                [NORMALIZED_TYPE_KEY]: normalization.name,
                value: is.primitive(normalized) ? normalized :
                    new Proxy(
                        this.getProxyTargetForNormalizedValue(normalized),
                        this.createProxyHandlerForValue(normalized)
                    )
            }
        }

        return new Proxy(
            this.getProxyTargetForNormalizedValue(data),
            this.createProxyHandlerForValue(data)
        );
    }

    private getProxyTargetForNormalizedValue(value: any) {
        if (Array.isArray(value)) {
            return [];
        }
        return {}
    }

    private createProxyHandlerForValue(value: any) {
        return {
            getPrototypeOf() {
                return Object.getPrototypeOf(value);
            },
            has(target: any, property: string | number) {
                return property in value;
            },
            ownKeys() {
                return Object.getOwnPropertyNames(value);
            },
            getOwnPropertyDescriptor(target: any, property: string | number) {

                const descriptor = Object.getOwnPropertyDescriptor(value, property);
                // make a property configurable
                if (!descriptor.configurable) {
                    return {...descriptor, configurable: true};
                }
                return descriptor;
            },
            get: (target: any, property: string | number) => {
                return this.normalize(value[property]);
            }
        }
    }

    private getNormalizationForObject(object: any) {
        const clazz = Object.getPrototypeOf(object).constructor;
        return this.clazzToNormalization.get(clazz);
    }

    denormalize(data: any): any {
        if (is.primitive(data)) {
            return data;
        }

        if (is.array(data)) {
            return data.map(this.denormalize, this);
        }

        if (NORMALIZED_TYPE_KEY in data) {
            const normalization = this.getNormalizationForType(data[NORMALIZED_TYPE_KEY]);
            if (normalization) {
                return normalization.denormalizer(this.denormalize(data.value));
            } else {
                throw new Error(`Missing normalization for type ${data[NORMALIZED_TYPE_KEY]}`);
            }
        }

        const newValue: any = {};
        for (const key in data) {
            newValue[key] = this.denormalize(data[key]);
        }
        return newValue;
    }

    private getNormalizationForType(type: string) {
        return this.nameToNormalization.get(type);
    }
}