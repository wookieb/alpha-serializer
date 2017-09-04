import {Serializer} from 'alpha-serializer-core';
import msgpack = require('msgpack5');
import {MessagePack} from "msgpack5";
import BufferList = require("bl");

export default class MsgPackSerializer implements Serializer<BufferList> {

    constructor(private packer?: MessagePack, private customTypeStartNumber = 0x00) {

        if (!this.packer) {
            this.packer = msgpack();
        }
        this.init();
    }

    protected init() {

    }

    serialize<R = any>(data: R): BufferList {
        return this.packer.encode(data);
    }

    deserialize<R = any>(data: BufferList): R {
        return this.packer.decode(data);
    }

    registerCustom<A = any>(clazz: Function, serializer: (data: A) => any, deserializer: (data: Buffer) => any) {
        this.packer.register(this.customTypeStartNumber++, clazz, serializer, deserializer);
        return this;
    }
}