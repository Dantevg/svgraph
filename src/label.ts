import Range from "./util/range"
import { Value } from "./util/util"

export abstract class Label implements Value {
	abstract value: Value
	abstract get text(): string
	abstract get axisType(): { new(range: Range<any>): Axis<Label> }
	valueOf() { return this.value.valueOf() }
}

export abstract class Axis<L extends Label> {
	constructor(public range: Range<L>) { }
	abstract getTicks(n: number): L[]
}
