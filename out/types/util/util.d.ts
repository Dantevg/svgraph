import Range from "./range";
import { Label } from "../label";
import { Point } from "../svgraph";
export type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;
/**
 * Any value that can be interpreted as a number.
 *
 * This automatically includes the native `number` type.
 */
export type Value = {
    valueOf(): number;
};
export declare const maxBy: <T>(arr: T[], fn: (x: T) => number) => T;
export declare const maxByKey: <T>(arr: T[], key: keyof T) => T;
export declare const minBy: <T>(arr: T[], fn: (x: T) => number) => T;
export declare const minByKey: <T>(arr: T[], key: keyof T) => T;
export declare const floorTo: (n: number, to: number) => number;
export declare function nearestLabel(t: number, range: Range<Label>, data: {
    name: string;
    points: Point[];
}[]): Label;
export declare const nearestPointForLabel: (arr: Point[], to: Label, range: Range<Label>) => Point;
