export interface Label {
	get text(): string
	getPos(min: Label, max: Label): number
}

/**
 * Un-lerps a value in a given [min,max] range to [0,1]
 */
const unlerp = (value, min, max) => (value - min) / (max - min)

export class NumberLabel implements Label {
	constructor(public value: number) { }

	get text() { return this.value.toString() }

	getPos = (min: NumberLabel, max: NumberLabel) => unlerp(this.value, min.value, max.value)
}

export class DateLabel implements Label {
	constructor(public value: Date) { }

	get text() { return this.value.toISOString().split("T")[0] }

	getPos = (min: DateLabel, max: DateLabel) => unlerp(this.value.valueOf(), min.value.valueOf(), max.value.valueOf())
}
