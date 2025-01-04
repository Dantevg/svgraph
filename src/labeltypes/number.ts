import { Axis, Label } from "../label"
import Range from "../util/range"

export class NumberLabel implements Label {
	constructor(public value: number) { }

	get text() { return this.value.toString() }
	get number() { return this.value }
	get axisType() { return NumberAxis }

	getPos = (range: Range<Label>) => range.normalize(this.number)
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
