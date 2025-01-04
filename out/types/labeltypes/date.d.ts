import { Axis, Label } from "../label";
import Range from "../util/range";
export declare class DateLabel implements Label {
    value: Date;
    constructor(value: Date);
    get text(): string;
    get number(): number;
    get axisType(): typeof DateAxis;
    getPos: (range: Range<Label>) => number;
}
export declare class DateAxis implements Axis<DateLabel> {
    range: Range<DateLabel>;
    constructor(range: Range<DateLabel>);
    getTicks(n: number): DateLabel[];
}
