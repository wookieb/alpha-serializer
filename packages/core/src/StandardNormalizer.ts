import Normalizer from "./Normalizer";

export default class StandardNormalizer extends Normalizer {
    constructor() {
        super();


        this._registerDate();
        this._registerMap();
        this._registerSet();
    }

    private _registerDate() {
        this.register(Date, 'Date', {
            normalizer(date: Date): string {
                return date.toISOString();
            },
            denormalizer(input: string) {
                return new Date(input);
            }
        });
    }

    private _registerMap() {
        this.register(Map, 'Map', {
            normalizer(map: Map<any, any>) {
                return [...map];
            },
            denormalizer(input: [any, any][]) {
                return new Map(input);
            }
        });
    }

    private _registerSet() {
        this.register(Set, 'Set', {
            normalizer(set: Set<any>) {
                return [...set];
            },
            denormalizer(input: any[]) {
                return new Set(input);
            }
        });
    }
}