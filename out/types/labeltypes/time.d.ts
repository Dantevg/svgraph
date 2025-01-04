import { Axis, Label } from "../label";
import Range from "../util/range";
export declare class TimeLabel implements Label {
    value: number;
    constructor(value: number);
    get text(): string;
    get number(): number;
    get axisType(): typeof TimeAxis;
    getPos: (range: Range<Label>) => number;
}
export declare class TimeAxis implements Axis<TimeLabel> {
    range: Range<TimeLabel>;
    constructor(range: Range<TimeLabel>);
    getTicks(n: number): TimeLabel[];
}
