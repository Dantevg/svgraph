import { Axis, Label } from "../label";
export declare class IntegerLabel extends Label {
    value: number;
    constructor(value: number);
    get text(): string;
    get axisType(): typeof IntegerAxis;
}
export declare class IntegerAxis extends Axis<IntegerLabel> {
    getTicks(n: number): IntegerLabel[];
}
