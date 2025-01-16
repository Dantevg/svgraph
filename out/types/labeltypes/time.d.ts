import { Axis, Label } from "../label";
export declare class TimeLabel extends Label {
    value: number;
    constructor(value: number);
    get text(): string;
    get axisType(): typeof TimeAxis;
}
export declare class TimeAxis extends Axis<TimeLabel> {
    getTicks(n: number): TimeLabel[];
}
