import MsgPackSerializer from "./MsgPackSerializer";
import BufferList = require("bl");


export default class StandardSerializer extends MsgPackSerializer {

    init() {
        this._registerDate();
    }

    private _registerDate() {
        this.registerCustom(Date, (d: Date) => {
            const buf = Buffer.alloc(8);
            buf.writeDoubleBE(+d, 0);
            return buf;
        }, (data: Buffer): Date => {
            return new Date(data.readDoubleBE(0))
        })
    }
}