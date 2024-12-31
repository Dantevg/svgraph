import { DateLabel, Label, MetricLabel, NumberLabel, TimeLabel } from "./label";

export interface Axis<L extends Label> {
	range: [L, L]
	getTicks(n: number): L[]
}

export class NumberAxis implements Axis<NumberLabel> {
	constructor(public range: [NumberLabel, NumberLabel]) { }

	getTicks(n: number): NumberLabel[] {
		const span = (this.range[1].number - this.range[0].number)

		const magnitude = Math.pow(10, Math.floor(Math.log10(span / n)) - 1)
		const interval = Math.floor(span / n / magnitude) * magnitude

		return [...Array(Math.floor(span / interval) + 1).keys().map(x =>
			new NumberLabel(Math.floor(x * interval + this.range[0].number))
		)]
	}
}

export class DateAxis implements Axis<DateLabel> {
	constructor(public range: [DateLabel, DateLabel]) { }

	getTicks(n: number): DateLabel[] {
		// total span in number of days
		const span = (this.range[1].number - this.range[0].number) / 24 / 60 / 60 / 1000

		const unitOffset = (span / 30 > n)
			? 30 // "months"
			: (span / 7 > n)
				? 7 // weeks
				: 1 // days

		const interval = Math.ceil(span / unitOffset / n) * unitOffset

		return [...Array(Math.floor(span / interval) + 1).keys().map(x => new DateLabel(new Date(x * interval * 24 * 60 * 60 * 1000 + this.range[0].number)))]
	}
}

export class TimeAxis implements Axis<TimeLabel> {
	constructor(public range: [TimeLabel, TimeLabel]) { }

	getTicks(n: number): TimeLabel[] {
		const span = (this.range[1].number - this.range[0].number)

		const unitOffset = (span / 24 / 60 / 60 > n)
			? 24 * 60 * 60 // days
			: (span / 60 / 60 > n)
				? 60 * 60 // hours
				: (span / 60 > n)
					? 60 // minutes
					: 1 // seconds

		const interval = Math.ceil(span / unitOffset / n) * unitOffset

		return [...Array(Math.floor(span / interval) + 1).keys().map(x => new TimeLabel(x * interval + this.range[0].number))]
	}
}

export class MetricAxis implements Axis<MetricLabel> {
	constructor(public range: [MetricLabel, MetricLabel]) { }

	getTicks = (n: number): MetricLabel[] =>
		[...Array(n).keys().map(x => new MetricLabel(
			Math.floor((x / (n - 1)) * (this.range[1].number - this.range[0].number) + this.range[0].number),
			this.range[0].unit
		))]
}
