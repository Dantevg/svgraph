import Range from "./util/range";
import { Value } from "./util/util";
export declare abstract class Label implements Value {
    abstract value: Value;
    abstract get text(): string;
    abstract get axisType(): {
        new (range: Range<any>): Axis<Label>;
    };
    valueOf(): number;
}
export declare abstract class Axis<L extends Label> {
    range: Range<L>;
    constructor(range: Range<L>);
    abstract getTicks(n: number): L[];
}
