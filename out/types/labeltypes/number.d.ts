import { Axis, Label } from "../label";
export declare class NumberLabel extends Label {
    value: number;
    constructor(value: number);
    get text(): string;
    get axisType(): typeof NumberAxis;
}
export declare class NumberAxis extends Axis<NumberLabel> {
    getTicks(n: number): NumberLabel[];
}
