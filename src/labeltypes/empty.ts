import { Axis, Label } from "../label"
import Range from "../util/range"

export class EmptyLabel implements Label {
	constructor() { }

	get text() { return "" }
	get number() { return 0 }
	get axisType() { return EmptyAxis }

	getPos = (_range: Range<Label>) => 0
}

export class EmptyAxis implements Axis<EmptyLabel> {
	range = new Range<EmptyLabel>(new EmptyLabel(), new EmptyLabel())
	constructor() { }

	getTicks(_n: number): EmptyLabel[] {
		return [new EmptyLabel()]
	}
}
