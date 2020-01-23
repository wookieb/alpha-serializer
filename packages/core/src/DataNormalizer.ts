import {Normalization, NormalizationInput} from "./Normalization";
import * as is from 'predicates';
import {simpleDenormalizer, simpleNormalizer} from "./normalizerFactory";

export const NORMALIZED_TYPE_KEY = '@type';

export class DataNormalizer {
    private nameToNormalization: Map<string, Normalization> = new Map();
    private clazzToNormalization: Map<new(...args: any[]) => any, Normalization> = new Map();

    constructor(public useProxy: boolean = true) {
    }

    public registerNormalization(normalizationInput: NormalizationInput) {
        const normalization = this.normalizationInputToNormalization(normalizationInput);
        this.nameToNormalization.set(normalization.name, normalization);
        this.clazzToNormalization.set(normalization.clazz, normalization);
    }

    private normalizationInputToNormalization(input: NormalizationInput) {
        is.assert(is.property('clazz', is.func), '"clazz" property is required and has to be a function');
        return new Normalization(
            input.name || input.clazz.name,
            input.clazz,
            input.normalizer ? input.normalizer : simpleNormalizer,
            input.denormalizer ? input.denormalizer : simpleDenormalizer.bind(null, input.clazz)
        );
    }

    public getNormalization(name: string) {
        return this.nameToNormalization.get(name);
    }

    /**
     * Normalizes data using registered normalizers.
     * Some normalizations might be excluded (by adapters for example)
     */
    public normalize(data: any, excludedNormalizations?: string[]): any {
        if (is.primitive(data)) {
            return data;
        }

        if (is.function(data)) {
            return;
        }

        if (is.array(data)) {
            return Array.prototype.map.call(data, (value: any) => this.normalize(value), this);
        }

        const normalization = this.getNormalizationForObject(data);

        if (normalization) {
            if (excludedNormalizations && excludedNormalizations.indexOf(normalization.name) !== -1) {
                return data;
            }
            const normalized = normalization.normalizer(data);
            return {
                [NORMALIZED_TYPE_KEY]: normalization.name,
                value: is.primitive(normalized) ? normalized : this.internalNormalize(normalized)
            };
        }

        return this.internalNormalize(data);
    }

    private internalNormalize(data: any) {
        return this.useProxy ? this.normalizeWithProxy(data) : this.normalizeWithoutProxy(data);
    }

    private normalizeWithProxy(data: any) {
        return new Proxy(
            this.getProxyTargetForNormalizedValue(data),
            this.createProxyHandlerForValue(data),
        );
    }

    private normalizeWithoutProxy(data: any) {
        if (Array.isArray(data)) {
            return data.map((x: any) => this.normalize(x));
        }
        const result: any = {};
        for (const key of Object.keys(data)) {
            result[key] = this.normalize(data[key]);
        }
        return result;
    }

    /**
     * Checks whether given value has any defined normalizations
     * Primitives, functions and arrays are ignored
     *
     * @param value
     * @returns {boolean}
     */
    public hasNormalization(value: any) {
        if (is.primitive(value) || is.function(value) || is.array(value)) {
            return false;
        }

        return is.object(value) && !!this.getNormalizationForObject(value);
    }

    public denormalize(data: any): any {
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
        // tslint:disable-next-line: forin
        for (const key in data) {
            newValue[key] = this.denormalize(data[key]);
        }
        return newValue;
    }

    private getProxyTargetForNormalizedValue(value: any) {
        if (Array.isArray(value)) {
            return [];
        }
        return {};
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
                if (descriptor && !descriptor.configurable) {
                    return {...descriptor, configurable: true};
                }
                return descriptor;
            },
            get: (target: any, property: string | number) => {
                const val = value[property];
                // usually functions are not serialized either so it's safe to return them
                if (is.func(val)) {
                    return val;
                }
                return this.normalize(val);
            },
        };
    }

    private getNormalizationForObject(object: any) {
        const prototype = Object.getPrototypeOf(object);

        if (prototype) {
            return this.clazzToNormalization.get(prototype.constructor);
        }
    }

    private getNormalizationForType(type: string) {
        return this.nameToNormalization.get(type);
    }
}