import { Value } from "./util"

export default class Range<T extends Value> {
	constructor(public min: T, public max: T) { }

	/**
	 * The unit range [0,1]
	 */
	static UNIT = new Range(0, 1) as Range<number>

	/**
	 * The span of this range, i.e. `max - min`
	 */
	get span() { return this.max.valueOf() - this.min.valueOf() }

	/**
	 * Returns whether a value is within this range
	 */
	contains = <U extends T>(value: U): boolean => this.min.valueOf() < value.valueOf() && value.valueOf() < this.max.valueOf()

	/**
	 * Clamps a value to this range
	 */
	clamp = <U extends T>(value: U): number => Math.max(this.min.valueOf(), Math.min(value.valueOf(), this.max.valueOf()))

	/**
	 * Normalizes a value in this range to [0,1]
	 */
	normalize = <U extends T>(value: U): number => (this.span != 0) ? (value.valueOf() - this.min.valueOf()) / this.span : 0

	/**
	 * Interpolates a `t` in [0,1] to this range
	 */
	lerp = (t: number): number => this.min.valueOf() + t * this.span
}
