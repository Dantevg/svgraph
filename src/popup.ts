import { div, h3, p, span } from "./util/html"
import Range from "./util/range"
import { minByKey, nearestLabel } from "./util/util"
import { Point } from "./svgraph"
import { Label } from "./label"

const nearestPointForLabel = (arr: Point[], to: Label, range: Range<Label>): Point =>
	minByKey(arr.map(x => [x, Math.abs(range.normalize(x.label) - range.normalize(to))]) as [Point, number][], 1)[0]

export default class PopupElement extends HTMLElement {
	constructor() {
		super()
		this.setAttribute("hidden", "")
	}

	show() { this.removeAttribute("hidden") }

	hide() { this.setAttribute("hidden", "") }

	move(x: number, y: number) {
		this.style.left = `${x + 20}px`
		this.style.top = `${y}px`
	}

	update(x: number, y: number, t: number, range: Range<Label>, data: { name: string, colour: string, points: Point[] }[]): Point[] {
		this.move(x, y)

		const label = nearestLabel(t, range, data)

		this.innerHTML = ""
		this.appendChild(h3({}, new Text(label?.text)))

		const nearestPoints = data.map(({ name, colour, points }) => ({ name, colour, point: nearestPointForLabel(points, label, range) }))
		this.setValues(nearestPoints)

		this.show()

		return nearestPoints.map(x => x.point)
	}

	private setValues(points: { name: string, colour: string, point: Point }[]) {
		for (const { name, colour, point: { value } } of points) {
			if (value != undefined && value.valueOf() != 0) this.appendChild(p({},
				div({ class: "swatch", style: `background-color: ${colour}` }),
				span({ class: "name" }, new Text(name)),
				new Text(": "),
				span({ class: "value" }, new Text(value.text)),
			))
		}
	}
}

customElements.define("svg-popup", PopupElement)
