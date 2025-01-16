import { Axis, Label } from "../label"

export class TimeLabel extends Label {
	constructor(public value: number) { super() }

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
	get axisType() { return TimeAxis }
}

export class TimeAxis extends Axis<TimeLabel> {
	getTicks(n: number): TimeLabel[] {
		const unitOffset = (this.range.span / 24 / 60 / 60 > n)
			? 24 * 60 * 60 // days
			: (this.range.span / 60 / 60 > n)
				? 60 * 60 // hours
				: (this.range.span / 60 > n)
					? 60 // minutes
					: 1 // seconds

		const interval = Math.ceil(this.range.span / unitOffset / n) * unitOffset

		return [...Array(Math.floor(this.range.span / interval) + 1).keys().map(x =>
			new TimeLabel(x * interval + this.range.min.valueOf())
		)]
	}
}
