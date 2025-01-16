import { Axis, Label } from "../label";
import Range from "../util/range";
import { Value } from "../util/util";
export declare class EmptyLabel extends Label {
    value: Value;
    constructor();
    get text(): string;
    get axisType(): typeof EmptyAxis;
}
export declare class EmptyAxis extends Axis<EmptyLabel> {
    static RANGE: Range<EmptyLabel>;
    constructor(_range?: Range<Label>);
    getTicks(_n: number): EmptyLabel[];
}
