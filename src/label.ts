export interface Label {
	get text(): string
	getPos(min: Label, max: Label): number
}

export class NumberLabel implements Label {
	constructor(public value: number) { }

	get text() { return this.value.toString() }

	getPos(min: NumberLabel, max: NumberLabel) { return (this.value - min.value) / (max.value - min.value) }
}

// TODO: date labels etc
