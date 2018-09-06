import {Adapter, normalizations} from 'alpha-serializer';

const msgpack = require('msgpack5');

export interface CustomType<T> {
    type: number;
    normalizationName?: string;
    class: { new(...args: any[]): any };
    encode: (value: T) => Buffer;
    decode: (value: Buffer) => T;
}

export interface AdapterOptions {
    forceFloat64?: boolean;
    compatibilityMode?: boolean;
    disableTimestampEncoding?: boolean;
}

export class MsgpackAdapter implements Adapter<Buffer> {
    private msgpack: any;
    private customTypesNormalizations: string[] = [];
    private readonly isDateSerializationEnabled: boolean;

    constructor(options?: AdapterOptions) {
        this.msgpack = msgpack(options);

        this.isDateSerializationEnabled = options ? !options.disableTimestampEncoding : true;
    }

    public serialize(data: any): Buffer {
        return this.msgpack.encode(data).slice();
    }

    public deserialize(input: Buffer): any {
        return this.msgpack.decode(input);
    }

    /**
     * Registers custom encoding and decoding for objects of given class
     *
     * If "normalizationName" gets provided then such normalizations gets disabled
     */
    public registerCustomType(customType: CustomType<any>): this {
        if (customType.normalizationName) {
            this.customTypesNormalizations.push(customType.normalizationName);
        }
        this.msgpack.register(customType.type, customType.class, customType.encode, customType.decode);
        return this;
    }

    get excludedNormalizations() {
        if (this.isDateSerializationEnabled) {
            return this.customTypesNormalizations.concat([normalizations.DATE.name]);
        }
        return this.customTypesNormalizations;
    }
}
