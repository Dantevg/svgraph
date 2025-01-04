export default class Range<T extends number | {
    number: number;
}> {
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
    contains: (value: T) => boolean;
    /**
     * Clamps a value to this range
     */
    clamp: (value: number) => number;
    /**
     * Normalizes a value in a given [min,max] range to [0,1]
     */
    normalize: (value: number) => number;
    /**
     * Interpolates a `t` in [0,1] to a given [min,max] range
     */
    lerp: (t: number) => number;
}
