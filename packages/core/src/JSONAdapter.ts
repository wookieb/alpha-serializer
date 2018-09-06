import {Adapter} from "./Adapter";

export class JSONAdapter implements Adapter<string> {
    public serialize(data: any) {
        return JSON.stringify(data);
    }

    public deserialize(data: string): any {
        return JSON.parse(data);
    }
}