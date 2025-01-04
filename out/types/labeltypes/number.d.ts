import { Axis, Label } from "../label";
import Range from "../util/range";
export declare class NumberLabel implements Label {
    value: number;
    constructor(value: number);
    get text(): string;
    get number(): number;
    get axisType(): typeof NumberAxis;
    getPos: (range: Range<Label>) => number;
}
export declare class NumberAxis implements Axis<NumberLabel> {
    range: Range<NumberLabel>;
    constructor(range: Range<NumberLabel>);
    getTicks(n: number): NumberLabel[];
}
