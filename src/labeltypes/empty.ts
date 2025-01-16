import { Axis, Label } from "../label"
import Range from "../util/range"
import { Value } from "../util/util"

export class EmptyLabel extends Label {
	value: Value = { valueOf: () => 0 }
	constructor() { super() }

	get text() { return "" }
	get axisType() { return EmptyAxis }
}

export class EmptyAxis extends Axis<EmptyLabel> {
	static RANGE = new Range(new EmptyLabel(), new EmptyLabel())
	constructor(_range?: Range<Label>) { super(EmptyAxis.RANGE) }

	getTicks(_n: number): EmptyLabel[] {
		return [new EmptyLabel()]
	}
}
