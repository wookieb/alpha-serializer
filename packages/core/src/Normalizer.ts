import {primitive as isPrimitive, string as isString, func as isFunction} from 'predicates';
import {NormalizationRef} from "./Adapter";

export const NORMALIZED_TYPE_KEY = '_@type';

export interface BaseConfig {
    normalizer?: NormalizerFunc,
    denormalizer?: DenormalizerFunc
}

export interface Config extends BaseConfig {
    clazz: Function;
    name: string;
}

export type NormalizerFunc = (object: any) => any;
export type DenormalizerFunc = (data: any) => any;

export const NOOP_NORMALIZER = (object: any) => object;

export default class Normalizer {
    private config: Map<Function, Config> = new Map();
    private configByName: Map<string, Config> = new Map();

    normalize(object: any, ignoredNormalizations: NormalizationRef[] = []) {
        if (isPrimitive(object)) {
            return object;
        }

        const handler = {
            get: (target: any, property: string): any => {
                const value = target[property];
                return normalizeValue(value);
            }
        };

        const normalizeValue = (value: any) => {
            if (isPrimitive(value)) {
                return value;
            }

            // ignore functions as they're not serializable at all
            if (isFunction(value)) {
                return;
            }

            const config = this.getConfigForObject(value);
            if (this.isIgnoredNormalization(config, ignoredNormalizations)) {
                return new Proxy(value, handler);
            }

            const normalized = (config.normalizer || NOOP_NORMALIZER)(value);

            return {
                [NORMALIZED_TYPE_KEY]: config.name,
                value: isPrimitive(normalized) ? normalized : new Proxy(normalized, handler)
            }
        };

        return normalizeValue(object);
    }

    private isIgnoredNormalization(config: Config, ignoredNormalizations: NormalizationRef[]) {
        return ignoredNormalizations.some(n => config.clazz === n || config.name === config.name);
    }


    private getConfigForObject(object: any): Config {
        const clazz = Object.getPrototypeOf(object).constructor;
        return this.config.get(clazz);
    }

    private getConfigForType(type: string): Config {
        return this.configByName.get(type);
    }

    register(clazz: Function, name: string, config?: BaseConfig): this;
    register(clazz: Function, config?: BaseConfig): this;
    register(clazz: Function, name: string | BaseConfig, config?: BaseConfig): this {
        if (!isString(name)) {
            config = <BaseConfig>name;
            name = clazz.name;
        }

        const entry: Config = {
            name: <string>name,
            clazz,
            normalizer: config && config.normalizer,
            denormalizer: config && config.denormalizer
        };

        this.configByName.set(entry.name, entry);
        this.config.set(clazz, entry);
        return this;
    }


    denormalize(data: any): any {
        if (isPrimitive(data)) {
            return data;
        }

        if (Array.isArray(data)) {
            return data.map(this.denormalize, this);
        }

        if (NORMALIZED_TYPE_KEY in data) {
            for (const key in data.value) {
                data.value[key] = this.denormalize(data.value[key]);
            }

            const type = data[NORMALIZED_TYPE_KEY];
            const config = this.getConfigForType(type);

            if (config && config.denormalizer) {
                return config.denormalizer(data.value);
            }
            return Object.assign(Object.create(config.clazz.prototype), data.value);
        } else {
            for (const key in data) {
                data[key] = this.denormalize(data[key]);
            }
        }
        return data;
    }
}
