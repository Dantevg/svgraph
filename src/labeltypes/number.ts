import { Axis, Label } from "../label"
import { floorTo } from "../util/util"

export class NumberLabel extends Label {
	constructor(public value: number) { super() }

	get text() { return this.value.toString() }
	get axisType() { return NumberAxis }
}

export class NumberAxis extends Axis<NumberLabel> {
	getTicks(n: number): NumberLabel[] {
		const magnitude = Math.pow(10, Math.floor(Math.log10(this.range.span / n)) - 1)
		const interval = floorTo(this.range.span / n, magnitude)

		return [...Array(Math.floor(this.range.span / interval) + 1).keys().map(x =>
			new NumberLabel(floorTo(x * interval + this.range.min.valueOf(), magnitude))
		)].filter((value, i, arr) => i == 0 || value.valueOf() != arr[i - 1].valueOf())
	}
}
