export interface Label {
	get text(): string
	getPos(min: number, max: number): number
}

export class NumberLabel implements Label {
	constructor(public value: number) { }

	get text() { return this.value.toString() }

	getPos(min: number, max: number) { return (this.value - min) / (max - min) }
}

// TODO: date labels etc
