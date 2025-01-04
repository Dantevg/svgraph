import { DateAxis, MetricAxis, NumberAxis, TimeAxis } from "./axis";
import Range from "./util/range";
export interface Label {
    get text(): string;
    get number(): number;
    get axisType(): any;
    getPos(range: Range<Label>): number;
}
export declare class NumberLabel implements Label {
    value: number;
    constructor(value: number);
    get text(): string;
    get number(): number;
    get axisType(): typeof NumberAxis;
    getPos: (range: Range<Label>) => number;
}
export declare class DateLabel implements Label {
    value: Date;
    constructor(value: Date);
    get text(): string;
    get number(): number;
    get axisType(): typeof DateAxis;
    getPos: (range: Range<Label>) => number;
}
export declare class TimeLabel implements Label {
    value: number;
    constructor(value: number);
    get text(): string;
    get number(): number;
    get axisType(): typeof TimeAxis;
    getPos: (range: Range<Label>) => number;
}
export declare class MetricLabel implements Label {
    value: number;
    unit: string;
    constructor(value: number, unit: string);
    get text(): string;
    get number(): number;
    get axisType(): typeof MetricAxis;
    getPos: (range: Range<Label>) => number;
    static units: string[];
    static unitsStartOffset: number;
    static largestOffset: (value: number) => number;
}
