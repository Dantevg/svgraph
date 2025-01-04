import { div, span } from "./util/html"

export default class LegendElement extends HTMLElement {
	lines: { name: string, colour: string }[]
	disabled: Set<string> = new Set()

	constructor(private callback: () => void) {
		super()
	}

	update(data: { name: string, colour: string }[]) {
		this.lines = data
		this.innerHTML = ""
		for (const { name, colour } of data) {
			const legendItem = span({ class: "legend-item" },
				div({ class: "swatch", style: `background-color: ${colour}` }),
				span({ class: "name" }, new Text(name)),
			)
			legendItem.classList.toggle("disabled", this.disabled.has(name))
			this.appendChild(legendItem)
			legendItem.addEventListener("click", () => this.onLegendItemClick(name, legendItem))
		}
	}

	private onLegendItemClick(name: string, legendItem: HTMLElement) {
		if (this.disabled.has(name)) this.disabled.delete(name)
		else this.disabled.add(name)
		legendItem.classList.toggle("disabled", this.disabled.has(name))
		this.callback()
	}
}

customElements.define("svg-legend", LegendElement)
