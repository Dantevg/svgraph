import { Axis, Label } from "../label"
import Range from "../util/range"

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

export class MetricAxis implements Axis<MetricLabel> {
	constructor(public range: Range<MetricLabel>) { }

	getTicks = (n: number): MetricLabel[] =>
		[...Array(n).keys().map(x => new MetricLabel(
			Math.floor(this.range.lerp(x / (n - 1))),
			this.range.min.unit
		))]
}
