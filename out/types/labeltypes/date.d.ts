import { Axis, Label } from "../label";
export declare class DateLabel extends Label {
    value: Date;
    constructor(value: Date);
    get text(): string;
    get axisType(): typeof DateAxis;
}
export declare class DateAxis extends Axis<DateLabel> {
    getTicks(n: number): DateLabel[];
}
