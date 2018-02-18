import {Adapter} from "./Adapter";

export class JSONAdapter implements Adapter<string> {
    serialize(data: any) {
        return JSON.stringify(data);
    }

    deserialize(data: string): any {
        return JSON.parse(data);
    }
}