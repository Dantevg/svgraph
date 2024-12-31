import { div, h3, p, span } from "./html"
import { Label } from "./label"
import { Point } from "./svgraph"

const nearestIdx = (arr: number[], to: number): number =>
	arr.map((x, idx) => [Math.abs(x - to), idx]).minBy(x => x[0])[1]

const nearestPointForLabel = (arr: Point[], to: Label, range: [Label, Label]): Point =>
	(arr.map(x => [x, Math.abs(x.label.getPos(...range) - to.getPos(...range))]) as [Point, number][]).minBy(x => x[1])[0]

function nearestLabel(t: number, range: [Label, Label], data: { name: string; points: Point[] }[]) {
	const nearestLabelsIdx = data.map(({ points }) => nearestIdx(points.map(p => p.label.getPos(...range)), t))
	const nearestLabels = nearestLabelsIdx.map((closestIdx, i) => data[i].points[closestIdx].label)
	return nearestLabels.minBy(l => Math.abs(l.getPos(...range) - t))
}

export default class PopupElement extends HTMLDivElement {
	constructor() {
		super()
	}

	show() { this.classList.add("active") }

	hide() { this.classList.remove("active") }

	move(x: number, y: number) {
		this.style.left = `${x + 20}px`
		this.style.top = `${y}px`
	}

	setValues(points: { name: string, colour: string, point: Point }[]) {
		for (const { name, colour, point: { value } } of points) {
			if (value != undefined && value.number != 0) this.appendChild(p({},
				div({ class: "swatch", style: `background-color: ${colour}` }),
				span({ class: "name" }, new Text(name)),
				new Text(": "),
				span({ class: "value" }, new Text(value.text)),
			))
		}
	}

	update(x: number, y: number, t: number, range: [Label, Label], data: { name: string, colour: string, points: Point[] }[]): Point[] {
		this.move(x, y)

		const label = nearestLabel(t, range, data)

		this.innerHTML = ""
		this.appendChild(h3({}, new Text(label.text)))

		const nearestPoints = data.map(({ name, colour, points }) => ({ name, colour, point: nearestPointForLabel(points, label, range) }))
		this.setValues(nearestPoints)

		this.show()

		return nearestPoints.map(x => x.point)
	}
}

customElements.define("svg-popup", PopupElement, { extends: "div" })
