const num = (n: number | { number: number }) => typeof n === "number" ? n : n.number

export default class Range<T extends number | { number: number }> {
	constructor(public min: T, public max: T) { }

	/**
	 * The unit range [0,1]
	 */
	static UNIT = new Range(0, 1) as Range<number>

	/**
	 * The span of this range, i.e. `max - min`
	 */
	get span() { return num(this.max) - num(this.min) }

	/**
	 * Returns whether a value is within this range
	 */
	contains = (value: T): boolean => num(this.min) < num(value) && num(value) < num(this.max)

	/**
	 * Clamps a value to this range
	 */
	clamp = (value: number): number => Math.max(num(this.min), Math.min(value, num(this.max)))

	/**
	 * Normalizes a value in a given [min,max] range to [0,1]
	 */
	normalize = (value: number): number => (value - num(this.min)) / (this.span)

	/**
	 * Interpolates a `t` in [0,1] to a given [min,max] range
	 */
	lerp = (t: number): number => num(this.min) + t * this.span
}
