import { Axis, Label } from "../label"

export class MetricLabel extends Label {
	constructor(public value: number, public unit: string) { super() }

	get text() {
		const offset = MetricLabel.largestOffset(this.value)
		return `${Math.floor(this.value / Math.pow(10, offset * 3))} ${MetricLabel.units[offset + MetricLabel.unitsStartOffset]}${this.unit}`
	}
	get axisType() { return MetricAxis }

	static units = ["n", "u", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"]
	static unitsStartOffset = 3

	static largestOffset = (value: number): number =>
		(value == 0) ? 0 : Math.floor(Math.log10(value) / 3)
}

export class MetricAxis extends Axis<MetricLabel> {
	getTicks = (n: number): MetricLabel[] =>
		[...Array(n).keys().map(x => new MetricLabel(
			Math.floor(this.range.lerp(x / (n - 1))),
			this.range.min.unit
		))]
}
