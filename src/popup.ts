import { div, h3, span, table, td, tr } from "./util/html"
import { Dataset, Point } from "./svgraph"
import { Label } from "./label"

export default class PopupElement extends HTMLElement {
	constructor() {
		super()
		this.setAttribute("hidden", "")
	}

	show() { this.removeAttribute("hidden") }

	hide() { this.setAttribute("hidden", "") }

	move(x: number, y: number, anchor: 'left' | 'right' = 'left') {
		this.style[anchor] = `${x + 20}px`
		this.style[anchor == 'left' ? 'right' : 'left'] = "auto"
		this.style.top = `${y}px`
	}

	update(x: number, y: number, t: number, rect: DOMRect, label: Label, data: Dataset[], points: Point[]) {
		if (t <= 0.5) {
			this.move(x, y, 'left')
		} else {
			// Show popup to the left of the cursor if on the right half of the graph
			this.move(rect.width - x, y, 'right')
		}

		this.innerHTML = ""
		this.appendChild(h3({}, new Text(label?.text)))
		this.setValues(data.map((d, i) => [d, points[i]]))

		this.show()
	}

	private setValues(points: [Dataset, Point][]) {
		let rows = []
		for (const [{ name, colour }, { value }] of points) {
			if (value != undefined && value.valueOf() != 0) rows.push(tr({},
				td({}, 
					div({ class: "swatch", style: `background-color: ${colour}` }),
					span({ class: "name" }, new Text(name)),
				),
				td({ class: "value" }, new Text(value.text)),
			))
		}
		this.appendChild(table({}, ...rows))
	}
}

customElements.define("svg-popup", PopupElement)
