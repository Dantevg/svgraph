import { DateLabel, Label, MetricLabel, NumberLabel, TimeLabel } from "./label"
import Range from "./util/range"

export interface Axis<L extends Label> {
	range: Range<L>
	getTicks(n: number): L[]
}

export class NumberAxis implements Axis<NumberLabel> {
	constructor(public range: Range<NumberLabel>) { }

	getTicks(n: number): NumberLabel[] {
		const magnitude = Math.pow(10, Math.floor(Math.log10(this.range.span / n)) - 1)
		const interval = Math.floor(this.range.span / n / magnitude) * magnitude

		return [...Array(Math.floor(this.range.span / interval) + 1).keys().map(x =>
			new NumberLabel(Math.floor(x * interval + this.range.min.number))
		)]
	}
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

export class TimeAxis implements Axis<TimeLabel> {
	constructor(public range: Range<TimeLabel>) { }

	getTicks(n: number): TimeLabel[] {
		const unitOffset = (this.range.span / 24 / 60 / 60 > n)
			? 24 * 60 * 60 // days
			: (this.range.span / 60 / 60 > n)
				? 60 * 60 // hours
				: (this.range.span / 60 > n)
					? 60 // minutes
					: 1 // seconds

		const interval = Math.ceil(this.range.span / unitOffset / n) * unitOffset

		return [...Array(Math.floor(this.range.span / interval) + 1).keys().map(x => new TimeLabel(x * interval + this.range.min.number))]
	}
}

export class MetricAxis implements Axis<MetricLabel> {
	constructor(public range: Range<MetricLabel>) { }

	getTicks = (n: number): MetricLabel[] =>
		[...Array(n).keys().map(x => new MetricLabel(
			Math.floor(this.range.lerp(x / (n - 1))),
			this.range.min.unit
		))]
}
