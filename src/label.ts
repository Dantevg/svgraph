import Range from "./util/range"

export interface Label {
	get text(): string
	get number(): number
	get axisType(): any
	getPos(range: Range<Label>): number
}

export interface Axis<L extends Label> {
	range: Range<L>
	getTicks(n: number): L[]
}

export * from "./labeltypes/number"
export * from "./labeltypes/date"
export * from "./labeltypes/time"
export * from "./labeltypes/metric"
