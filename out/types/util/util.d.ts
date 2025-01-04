import Range from "./range";
import { Label } from "../label";
import { Point } from "../svgraph";
export type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;
export declare const maxBy: <T>(arr: T[], fn: (x: T) => number) => T;
export declare const maxByKey: <T>(arr: T[], key: keyof T) => T;
export declare const minBy: <T>(arr: T[], fn: (x: T) => number) => T;
export declare const minByKey: <T>(arr: T[], key: keyof T) => T;
export declare function nearestLabel(t: number, range: Range<Label>, data: {
    name: string;
    points: Point[];
}[]): Label;
