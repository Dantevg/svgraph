import { Axis, Label } from "../label";
import Range from "../util/range";
export declare class EmptyLabel implements Label {
    constructor();
    get text(): string;
    get number(): number;
    get axisType(): typeof EmptyAxis;
    getPos: (_range: Range<Label>) => number;
}
export declare class EmptyAxis implements Axis<EmptyLabel> {
    range: Range<EmptyLabel>;
    constructor();
    getTicks(_n: number): EmptyLabel[];
}
