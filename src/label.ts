export interface Label {
	get text(): string
	get number(): number
	getPos(min: Label, max: Label): number
}

/**
 * Un-lerps a value in a given [min,max] range to [0,1]
 */
const unlerp = (value, min, max) => (value - min) / (max - min)

export class NumberLabel implements Label {
	constructor(public value: number) { }

	get text() { return this.value.toString() }
	get number() { return this.value }

	getPos = (min: NumberLabel, max: NumberLabel) => unlerp(this.value, min.value, max.value)
}

export class DateLabel implements Label {
	constructor(public value: Date) { }

	get text() { return this.value.toISOString().split("T")[0] }
	get number() { return this.value.valueOf() }

	getPos = (min: DateLabel, max: DateLabel) => unlerp(this.value.valueOf(), min.value.valueOf(), max.value.valueOf())
}

export class TimeLabel implements Label {
	constructor(public value: number, public offset: number) { }

	get text() {
		const inSeconds = this.value * this.offset
		const date = new Date(inSeconds * 1000)
		const d = Math.floor(inSeconds / 24 / 60 / 60)
		const h = date.getUTCHours()
		const m = date.getUTCMinutes()
		const s = date.getUTCSeconds() + date.getUTCMilliseconds() / 1000
		if (h > 0 || d > 0) {
			return `${h + d * 24}:${String(m).padStart(2, "0")} h`
		} else if (m > 0) {
			return `${m}:${String(Math.floor(s)).padStart(2, "0")}`
		} else {
			return `${s} s`
		}
	}
	get number() { return this.value }

	getPos = (min: TimeLabel, max: TimeLabel) => unlerp(this.value, min.value, max.value)
}

export class MetricLabel implements Label {
	constructor(public value: number, public offset: number, public unit: string) { }

	get text() {
		const value = this.value * this.offset
		const offset = MetricLabel.largestOffset(value)
		return `${Math.floor(value / Math.pow(10, offset * 3))} ${MetricLabel.units[offset + MetricLabel.unitsStartOffset]}${this.unit}`
	}
	get number() { return this.value }

	getPos = (min: MetricLabel, max: MetricLabel) => unlerp(this.value, min.value, max.value)

	static units = ["n", "u", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"]
	static unitsStartOffset = 3

	static largestOffset = (value: number): number =>
		(value == 0) ? 0 : Math.floor(Math.log10(value) / 3)
}
