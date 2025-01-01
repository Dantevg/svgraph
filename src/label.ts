import { DateAxis, MetricAxis, NumberAxis, TimeAxis } from "./axis"
import Range from "./util/range"

export interface Label {
	get text(): string
	get number(): number
	get axisType(): any
	getPos(range: Range<Label>): number
}

export class NumberLabel implements Label {
	constructor(public value: number) { }

	get text() { return this.value.toString() }
	get number() { return this.value }
	get axisType() { return NumberAxis }

	getPos = (range: Range<Label>) => range.normalize(this.number)
}

export class DateLabel implements Label {
	constructor(public value: Date) { }

	get text() { return this.value.toISOString().split("T")[0] }
	get number() { return this.value.valueOf() }
	get axisType() { return DateAxis }

	getPos = (range: Range<Label>) => range.normalize(this.number)
}

export class TimeLabel implements Label {
	constructor(public value: number) { }

	get text() {
		const date = new Date(this.value * 1000)
		const d = Math.floor(this.value / 24 / 60 / 60)
		const h = date.getUTCHours()
		const m = date.getUTCMinutes()
		const s = date.getUTCSeconds() + date.getUTCMilliseconds() / 1000
		if (h > 0 || d > 0) {
			if (m == 0) return `${h + d * 24} h`
			else return `${h + d * 24}:${String(m).padStart(2, "0")} h`
		} else if (m > 0) {
			return `${m}:${String(Math.floor(s)).padStart(2, "0")}`
		} else {
			return `${s} s`
		}
	}
	get number() { return this.value }
	get axisType() { return TimeAxis }

	getPos = (range: Range<Label>) => range.normalize(this.number)
}

export class MetricLabel implements Label {
	constructor(public value: number, public unit: string) { }

	get text() {
		const offset = MetricLabel.largestOffset(this.value)
		return `${Math.floor(this.value / Math.pow(10, offset * 3))} ${MetricLabel.units[offset + MetricLabel.unitsStartOffset]}${this.unit}`
	}
	get number() { return this.value }
	get axisType() { return MetricAxis }

	getPos = (range: Range<Label>) => range.normalize(this.number)

	static units = ["n", "u", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"]
	static unitsStartOffset = 3

	static largestOffset = (value: number): number =>
		(value == 0) ? 0 : Math.floor(Math.log10(value) / 3)
}
