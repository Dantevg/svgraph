import { DateLabel, Label, MetricLabel, NumberLabel, TimeLabel } from "./label";
import Range from "./util/range";
export interface Axis<L extends Label> {
    range: Range<L>;
    getTicks(n: number): L[];
}
export declare class NumberAxis implements Axis<NumberLabel> {
    range: Range<NumberLabel>;
    constructor(range: Range<NumberLabel>);
    getTicks(n: number): NumberLabel[];
}
export declare class DateAxis implements Axis<DateLabel> {
    range: Range<DateLabel>;
    constructor(range: Range<DateLabel>);
    getTicks(n: number): DateLabel[];
}
export declare class TimeAxis implements Axis<TimeLabel> {
    range: Range<TimeLabel>;
    constructor(range: Range<TimeLabel>);
    getTicks(n: number): TimeLabel[];
}
export declare class MetricAxis implements Axis<MetricLabel> {
    range: Range<MetricLabel>;
    constructor(range: Range<MetricLabel>);
    getTicks: (n: number) => MetricLabel[];
}
