import { Axis, Label } from "../label";
import Range from "../util/range";
export declare class IntegerLabel implements Label {
    value: number;
    constructor(value: number);
    get text(): string;
    get number(): number;
    get axisType(): typeof IntegerAxis;
    getPos: (range: Range<Label>) => number;
}
export declare class IntegerAxis implements Axis<IntegerLabel> {
    range: Range<IntegerLabel>;
    constructor(range: Range<IntegerLabel>);
    getTicks(n: number): IntegerLabel[];
}
