import { Axis, Label } from "../label";
export declare class MetricLabel extends Label {
    value: number;
    unit: string;
    constructor(value: number, unit: string);
    get text(): string;
    get axisType(): typeof MetricAxis;
    static units: string[];
    static unitsStartOffset: number;
    static largestOffset: (value: number) => number;
}
export declare class MetricAxis extends Axis<MetricLabel> {
    getTicks: (n: number) => MetricLabel[];
}
