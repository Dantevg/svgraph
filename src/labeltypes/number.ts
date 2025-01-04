import { Axis, Label } from "../label"
import Range from "../util/range"
import { floorTo } from "../util/util"

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
		const interval = floorTo(this.range.span / n, magnitude)

		return [...Array(Math.floor(this.range.span / interval) + 1).keys().map(x =>
			new NumberLabel(floorTo(x * interval + this.range.min.number, magnitude))
		)].filter((value, i, arr) => i == 0 || value.number != arr[i - 1].number)
	}
}
