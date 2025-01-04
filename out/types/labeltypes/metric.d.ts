import { Axis, Label } from "../label";
import Range from "../util/range";
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
export declare class MetricAxis implements Axis<MetricLabel> {
    range: Range<MetricLabel>;
    constructor(range: Range<MetricLabel>);
    getTicks: (n: number) => MetricLabel[];
}
