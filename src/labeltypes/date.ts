import { Axis, Label } from "../label"
import Range from "../util/range"

export class DateLabel implements Label {
	constructor(public value: Date) { }

	get text() { return this.value.toISOString().split("T")[0] }
	get number() { return this.value.valueOf() }
	get axisType() { return DateAxis }

	getPos = (range: Range<Label>) => range.normalize(this.number)
}

export class DateAxis implements Axis<DateLabel> {
	constructor(public range: Range<DateLabel>) { }

	getTicks(n: number): DateLabel[] {
		// total span in number of days
		const span = this.range.span / 24 / 60 / 60 / 1000

		const unitOffset = (span / 30 > n)
			? 30 // "months"
			: (span / 7 > n)
				? 7 // weeks
				: 1 // days

		const interval = Math.ceil(span / unitOffset / n) * unitOffset

		return [...Array(Math.floor(span / interval) + 1).keys().map(x => new DateLabel(new Date(x * interval * 24 * 60 * 60 * 1000 + this.range.min.number)))]
	}
}
