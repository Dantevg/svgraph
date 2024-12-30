import { h3, p } from "./html"
import { Label } from "./label"

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
		for (const {name, value} of values) {
			if (value != undefined) this.appendChild(p({}, new Text(`${name}: ${value}`)))
		}
	}

	update(x: number, y: number, idx: number, data: { name: string, points: { label: Label, value: number }[] }[]) {
		this.move(x, y)

		this.innerHTML = ""
		this.appendChild(h3({}, new Text(idx.toString())))
		// this.setValues(data.map(line => ({ name: line.name, value: line.values[idx] })))
		
		// TODO: get closest x label and get values from lines

		this.show()
	}
}

customElements.define("svg-popup", PopupElement, { extends: "div" })
