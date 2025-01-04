import { Axis, Label } from "../label"
import Range from "../util/range"
import { floorTo } from "../util/util"

export class IntegerLabel implements Label {
	constructor(public value: number) { this.value = Math.floor(value) }

	get text() { return this.value.toString() }
	get number() { return this.value }
	get axisType() { return IntegerAxis }

	getPos = (range: Range<Label>) => range.normalize(this.number)
}

export class IntegerAxis implements Axis<IntegerLabel> {
	constructor(public range: Range<IntegerLabel>) { }

	getTicks(n: number): IntegerLabel[] {
		const magnitude = Math.max(1, Math.pow(10, Math.floor(Math.log10(this.range.span / n)) - 1))
		const interval = floorTo(this.range.span / n, magnitude)

		return [...Array(Math.floor(this.range.span / interval) + 1).keys().map(x =>
			new IntegerLabel(x * interval + this.range.min.number)
		)].filter((value, i, arr) => i == 0 || value.number != arr[i - 1].number)
	}
}
