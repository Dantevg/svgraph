import { Label, NumberLabel } from "./label"
import { g, line, polyline, rect, svg, text } from "./svg"

export default class SVGraph {
	elem: SVGElement
	data: { name: string, values: number[] }[]
	maxX: number
	maxY: number
	xLabels: Label[]
	yLabels: Label[]
	private resizeObserver: ResizeObserver

	axisSize = 40

	constructor({ data }: { data: { [category: string]: number[] } }) {
		this.elem = svg({ width: "100%", height: "100%", overflow: "visible" })
		this.update(data, false)

		this.resizeObserver = new ResizeObserver((entries) => {
			this.draw(entries[0].contentBoxSize[0].inlineSize, entries[0].contentBoxSize[0].blockSize)
		})
		this.resizeObserver.observe(this.elem, { box: "content-box" })
	}

	update(lines: { [category: string]: number[] }, redraw = true) {
		this.data = Object.entries(lines).sort((a, b) => b[1].max() - a[1].max()).map(([name, values]) => ({ name, values }))

		this.maxX = this.data.map(({ values }) => values.length - 1).max()
		this.maxY = this.data[0].values.max()

		this.xLabels = new Set(this.data.flatMap(({ values }) => values.keys().toArray())).values().toArray().sort().map((i) => new NumberLabel(i))
		this.yLabels = [0, 10, 30].map(i => new NumberLabel(i))

		if (redraw) this.draw(this.elem.clientWidth, this.elem.clientHeight)
	}

	draw(width: number, height: number) {
		this.elem.innerHTML = ""

		this.elem.appendChild(rect({ width: "100%", height: "100%", fill: "#EEE" }))
		this.elem.appendChild(this.lines(width - this.axisSize, height - this.axisSize))
		this.elem.appendChild(this.axes(width, height))
	}

	private axes(width: number, height: number): SVGElement {
		return g({ class: "axes" },
			this.xAxis(this.axisSize, height - this.axisSize, width - this.axisSize, this.axisSize),
			this.yAxis(0, 0, this.axisSize, height - this.axisSize)
		)
	}

	private xAxis = (x: number, y: number, width: number, height: number): SVGElement =>
		g({ class: "xaxis" },
			line({ from: [x, y], to: [x + width, y], stroke: "black" }),
			...this.xLabels.map(step => text({
				x: x + step.getPos(this.maxX) * width,
				y: y + 20,
				"text-anchor": "middle"
			}, new Text(step.text)))
		)

	private yAxis = (x: number, y: number, width: number, height: number): SVGElement =>
		g({ class: "yaxis" },
			line({ from: [x + width, y], to: [x + width, y + height], stroke: "black" }),
			...this.yLabels.map(step => text({
				x: x + width - 10,
				y: y + height - step.getPos(this.maxY) * height,
				"text-anchor": "end"
			}, new Text(step.text)))
		)

	private lines(width: number, height: number): SVGElement {
		const elem = g({ class: "lines", transform: `translate(${this.axisSize}, 0)`, "stroke-width": "2" })
		for (const { name, values } of this.data) {
			const points = values.map((y, x) => [x * width / this.maxX, (1 - y / this.maxY) * height] as [number, number])
			elem.appendChild(polyline({ points, fill: "none", stroke: "black" }))
		}
		return elem
	}
}

declare global {
	interface Array<T> {
		max(): number
		min(): number
	}
}

Array.prototype.max = function () { return this.reduce((a, b) => Math.max(a, b), 0) }
Array.prototype.min = function () { return this.reduce((a, b) => Math.min(a, b), 0) }
