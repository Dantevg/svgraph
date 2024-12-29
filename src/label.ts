export interface Label {
	get text(): string
	getPos(max: number): number
}

export class NumberLabel implements Label {
	constructor(public value: number) { }

	get text() { return this.value.toString() }

	getPos(max: number) { return this.value / max }
}

// TODO: date labels etc
