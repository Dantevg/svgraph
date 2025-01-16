import { Value } from "./util";
export default class Range<T extends Value> {
    min: T;
    max: T;
    constructor(min: T, max: T);
    /**
     * The unit range [0,1]
     */
    static UNIT: Range<number>;
    /**
     * The span of this range, i.e. `max - min`
     */
    get span(): number;
    /**
     * Returns whether a value is within this range
     */
    contains: <U extends T>(value: U) => boolean;
    /**
     * Clamps a value to this range
     */
    clamp: <U extends T>(value: U) => number;
    /**
     * Normalizes a value in this range to [0,1]
     */
    normalize: <U extends T>(value: U) => number;
    /**
     * Interpolates a `t` in [0,1] to this range
     */
    lerp: (t: number) => number;
}
