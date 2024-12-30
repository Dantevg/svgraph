import { h3, p } from "./html"
import { Label } from "./label"

const nearestIdx = (arr: number[], to: number): number =>
	arr.map((x, idx) => [Math.abs(x - to), idx]).minBy(x => x[0])[1]

const nearestForLabel = <T extends { label: Label }>(arr: T[], to: Label, range: [Label, Label]): T =>
	(arr.map(x => [x, Math.abs(x.label.getPos(...range) - to.getPos(...range))]) as [T, number][]).minBy(x => x[1])[0]

export default class PopupElement extends HTMLDivElement {
	constructor() {
		super()
	}

	show() { this.classList.add("active") }

	hide() { this.classList.remove("active") }

	move(x: number, y: number) {
		this.style.left = `${x + 10}px`
		this.style.top = `${y}px`
	}

	setValues(values: { name: string, value: number }[]) {
		for (const { name, value } of values) {
			if (value != undefined) this.appendChild(p({}, new Text(`${name}: ${value}`)))
		}
	}

	update(x: number, y: number, t: number, range: [Label, Label], data: { name: string, points: { label: Label, value: number }[] }[]) {
		this.move(x, y)

		const closestLabelsIdx = data.map(({ points }) => nearestIdx(points.map(p => p.label.getPos(...range)), t))
		const closestLabels = closestLabelsIdx.map((closestIdx, i) => data[i].points[closestIdx].label)
		const closestLabel = closestLabels.minBy(l => Math.abs(l.getPos(...range) - t))

		this.innerHTML = ""
		this.appendChild(h3({}, new Text(closestLabel.text)))
		this.setValues(data.map(({ name, points }) => ({ name, value: nearestForLabel(points, closestLabel, range).value })))

		this.show()
	}
}

customElements.define("svg-popup", PopupElement, { extends: "div" })
