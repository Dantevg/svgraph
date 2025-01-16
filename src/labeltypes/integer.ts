import { Axis, Label } from "../label"
import { floorTo } from "../util/util"

export class IntegerLabel extends Label {
	constructor(public value: number) { super(); this.value = Math.floor(value) }

	get text() { return this.value.toString() }
	get axisType() { return IntegerAxis }
}

export class IntegerAxis extends Axis<IntegerLabel> {
	getTicks(n: number): IntegerLabel[] {
		const magnitude = Math.max(1, Math.pow(10, Math.floor(Math.log10(this.range.span / n)) - 1))
		const interval = floorTo(this.range.span / n, magnitude)

		return [...Array(Math.floor(this.range.span / interval) + 1).keys().map(x =>
			new IntegerLabel(x * interval + this.range.min.valueOf())
		)].filter((value, i, arr) => i == 0 || value.valueOf() != arr[i - 1].valueOf())
	}
}
