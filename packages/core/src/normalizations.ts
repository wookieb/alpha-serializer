import {Normalization} from "./Normalization";

export const MAP = new Normalization<Map<any, any>>(
    'Map',
    Map,
    (data: Map<any, any>) => {
        return Array.from(data.entries());
    },
    (data: any[]) => {
        return new Map(data);
    },
);

export const SET = new Normalization<Set<any>>(
    'Set',
    Set,
    (data: Set<any>) => {
        return Array.from(data);
    },
    (data: any[]) => {
        return new Set(data);
    },
);

export const DATE = new Normalization<Date>(
    'Date',
    Date,
    (data: Date) => {
        return data.toISOString();
    },
    (data: string) => {
        return new Date(data);
    },
);