import {Adapter} from "./Adapter";

export class JSONAdapter implements Adapter<string> {

    constructor(private options: {
        reviver?: (key: any, value: any) => any;
        replacer?: (key: string, value: any) => any;
        space?: number;
    } = {}) {

    }

    public serialize(data: any) {
        return JSON.stringify(data, this.options.replacer, this.options.space);
    }

    public deserialize(data: string): any {
        return JSON.parse(data, this.options.reviver);
    }
}