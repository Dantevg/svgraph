// Array-like functions for objects
// https://stackoverflow.com/a/37616104

export const filter = <V>(obj: { [k: string]: V }, predicate: (_: V) => boolean): { [k: string]: V } =>
	Object.fromEntries(Object.entries(obj).filter(([_, v]) => predicate(v)))

export const map = <V>(obj: { [k: string]: V }, mapper: (k: string, v: V) => V) =>
	Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, mapper(k, v)]))

const num = (n: number | { number: number }) => typeof n === "number" ? n : n.number

export class Range<T extends number | { number: number }> {
	constructor(public min: T, public max: T) { }

	/**
	 * The unit range [0,1]
	 */
	static UNIT = new Range(0, 1)

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
