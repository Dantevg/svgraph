import { turbo } from "./colourschemes"
import { Label, NumberLabel } from "./label"
import { g, line, polyline, svg, text } from "./svg"

export { Label, NumberLabel } from "./label"

export type Config = {
	data: { [category: string]: number[] }
	xLabels?: Label[]
	yLabels?: Label[]
	style?: Style
}

export type Style = {
	xAxisSize?: number
	yAxisSize?: number
	minSpacePerXLabel?: number
	minSpacePerYLabel?: number
}

export default class SVGraph {
	elem: SVGElement

	data: { name: string, values: number[] }[]
	xLabels: Label[]
	yLabels: Label[]
	style: Style

	maxX: number
	maxY: number
	private resizeObserver: ResizeObserver

	getXLabelInterval = (width: number): number =>
		Math.ceil(this.xLabels.length / (width / this.style.minSpacePerXLabel))

	getYLabelInterval = (height: number): number =>
		Math.ceil(this.yLabels.length / (height / this.style.minSpacePerYLabel))

	constructor(config: Config) {
		this.elem = svg({ width: "100%", height: "100%", overflow: "visible" })
		this.update(config, false)

		this.resizeObserver = new ResizeObserver((entries) => {
			this.draw(entries[0].contentBoxSize[0].inlineSize, entries[0].contentBoxSize[0].blockSize)
		})
		this.resizeObserver.observe(this.elem, { box: "content-box" })
	}

	update({ data, xLabels, yLabels, style }: Config, redraw = true) {
		this.data = Object.entries(data).sort((a, b) => b[1].max() - a[1].max()).map(([name, values]) => ({ name, values }))

		this.maxX = this.data.map(({ values }) => values.length - 1).max()
		this.maxY = this.data[0].values.max()

		this.xLabels = xLabels ?? new Set(this.data.flatMap(({ values }) => values.keys().toArray()))
			.values().toArray().sort((a, b) => a - b).map((i) => new NumberLabel(i))
		this.yLabels = yLabels ?? [new NumberLabel(0), new NumberLabel(this.maxY)]

		this.style = {
			xAxisSize: style?.xAxisSize ?? 30,
			yAxisSize: style?.yAxisSize ?? 30,
			minSpacePerXLabel: style?.minSpacePerXLabel ?? 50,
			minSpacePerYLabel: style?.minSpacePerYLabel ?? 50,
		}

		if (redraw) this.draw(this.elem.clientWidth, this.elem.clientHeight)
	}

	draw(width: number, height: number) {
		this.elem.innerHTML = ""

		this.elem.appendChild(this.grid(this.style.yAxisSize, 0, width - this.style.yAxisSize, height - this.style.xAxisSize))
		this.elem.appendChild(this.axes(0, 0, width, height))
		this.elem.appendChild(this.lines(this.style.yAxisSize, 0, width - this.style.yAxisSize, height - this.style.xAxisSize))
	}

	private axes(x: number, y: number, width: number, height: number): SVGElement {
		return g({ class: "axes", transform: `translate(${x}, ${y})` },
			this.xAxis(this.style.yAxisSize, height - this.style.xAxisSize, width - this.style.yAxisSize, this.style.xAxisSize),
			this.yAxis(0, 0, this.style.yAxisSize, height - this.style.xAxisSize)
		)
	}

	private xAxis = (x: number, y: number, width: number, height: number): SVGElement =>
		g({ class: "xaxis" },
			line({ from: [x, y], to: [x + width, y], stroke: "black" }),
			...this.xLabels.filter((_, i) => i % this.getXLabelInterval(width) == 0)
				.map(step => text({
					x: x + step.getPos(this.maxX) * width,
					y: y + 20,
					"text-anchor": "middle"
				}, new Text(step.text)))
		)

	private yAxis = (x: number, y: number, width: number, height: number): SVGElement =>
		g({ class: "yaxis" },
			line({ from: [x + width, y], to: [x + width, y + height], stroke: "black" }),
			...this.yLabels.filter((_, i) => i % this.getYLabelInterval(height) == 0)
				.map(step => text({
					x: x + width - 10,
					y: y + (1 - step.getPos(this.maxY)) * height + 5,
					"text-anchor": "end"
				}, new Text(step.text)))
		)

	private grid = (x: number, y: number, width: number, height: number): SVGElement =>
		g({ class: "grid", transform: `translate(${x}, ${y})` },
			...this.xLabels.map(step => line({
				from: [step.getPos(this.maxX) * width, 0],
				to: [step.getPos(this.maxX) * width, height],
				stroke: "#0004"
			})),
			...this.yLabels.map(step => line({
				from: [0, (1 - step.getPos(this.maxY)) * height],
				to: [width, (1 - step.getPos(this.maxY)) * height],
				stroke: "#0004"
			})),
		)

	private lines = (x: number, y: number, width: number, height: number): SVGElement =>
		g({ class: "lines", transform: `translate(${x}, ${y})`, "stroke-width": "2" },
			...this.data.map(({ values }, i) => {
				const colour = turbo[Math.floor((i + 1) / (this.data.length + 1) * turbo.length)]
				const points = values.map((y, x) => [x * width / this.maxX, (1 - y / this.maxY) * height] as [number, number])
				return polyline({ points, fill: "none", stroke: colour })
			})
		)
}

declare global {
	interface Array<T> {
		max(): number
		min(): number
	}
}

Array.prototype.max = function () { return this.reduce((a, b) => Math.max(a, b), 0) }
Array.prototype.min = function () { return this.reduce((a, b) => Math.min(a, b), 0) }
