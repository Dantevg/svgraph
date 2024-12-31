import { Axis, DateAxis, NumberAxis } from "./axis"
import { DateLabel, Label, NumberLabel } from "./label"
import PopupElement from "./popup"
import { circle, g, line, polyline, rect, svg, text } from "./svg"

export { Label, NumberLabel, DateLabel, MetricLabel } from "./label"

// TODO: remove these re-exports in release, only for testing
export { getData } from "./data"
export * from "./colourschemes"

export type Point = { label: Label, value: Label }

export type Config = {
	data: { [category: string]: Point[] }
	styles?: Partial<Styles>
}

export type Styles = {
	colourscheme: string[]
	xAxis: {
		height: number
		labelSpacing: number
		labelRotation: number
	}
	yAxis: {
		width: number
		labelSpacing: number
		labelRotation: number
	}
	grid: {
		stroke: string
	}
	guideline: {
		stroke: string
		width: number
		points: {
			r: number
			fill: string
		}
	}
	lines: {
		width: number
	}
}

type AxisData = {
	labels: Label[]
	range: [Label, Label]
}

export default class SVGraph extends HTMLElement {
	svgElem: SVGElement
	popupElem: PopupElement
	guideElem: SVGElement

	data: { name: string, colour: string, points: Point[] }[]
	styles: Styles
	xaxis: Axis<Label>
	yaxis: Axis<Label>

	private resizeObserver: ResizeObserver

	constructor(config: Config) {
		super()

		const shadow = this.attachShadow({ mode: "open" })

		const styleElem = document.createElement("style")
		styleElem.textContent = style
		shadow.appendChild(styleElem)

		this.svgElem = svg({ width: "100%", height: "100%", overflow: "visible", fill: "white" })
		shadow.appendChild(this.svgElem)

		this.popupElem = new PopupElement()
		this.popupElem.classList.add("popup")
		shadow.appendChild(this.popupElem)

		this.resizeObserver = new ResizeObserver((entries) => {
			this.draw(entries[0].contentBoxSize[0].inlineSize, entries[0].contentBoxSize[0].blockSize)
		})
		this.resizeObserver.observe(this.svgElem, { box: "content-box" })

		this.update(config, false)
	}

	update({ data, styles }: Config, redraw = true) {
		this.styles = {
			colourscheme: styles?.colourscheme ?? ["black"],
			xAxis: {
				height: styles?.xAxis?.height ?? 30,
				labelSpacing: styles?.xAxis?.labelSpacing ?? 30,
				labelRotation: styles?.xAxis?.labelRotation ?? 0,
			},
			yAxis: {
				width: styles?.yAxis?.width ?? 30,
				labelSpacing: styles?.yAxis?.labelSpacing ?? 50,
				labelRotation: styles?.yAxis?.labelRotation ?? 0,
			},
			grid: {
				stroke: styles?.grid?.stroke ?? "#FFF4",
			},
			guideline: {
				stroke: styles?.guideline?.stroke ?? "#FFF8",
				width: styles?.guideline?.width ?? 1,
				points: {
					r: styles?.guideline?.points?.r ?? 2,
					fill: styles?.guideline?.points?.fill ?? "white",
				},
			},
			lines: {
				width: styles?.lines?.width ?? 2,
			},
		}

		this.data = Object.entries(data)
			.sort((a, b) => b[1].at(-1).value.number - a[1].at(-1).value.number)
			.map(([name, points], i, arr) => ({ name, points, colour: getColour(this.styles.colourscheme, (i + 1) / (arr.length + 1)) }))

		this.xaxis = getAxis(this.data, "label")
		this.yaxis = getAxis(this.data, "value")

		if (redraw) this.draw(this.svgElem.clientWidth, this.svgElem.clientHeight)
	}

	draw(width: number, height: number) {
		this.svgElem.innerHTML = ""

		this.svgElem.appendChild(this.grid(this.styles.yAxis.width, 0, width - this.styles.yAxis.width, height - this.styles.xAxis.height))
		this.svgElem.appendChild(this.axes(0, 0, width, height))
		this.svgElem.appendChild(this.lines(this.styles.yAxis.width, 0, width - this.styles.yAxis.width, height - this.styles.xAxis.height))

		this.guideElem = this.guide(height - this.styles.xAxis.height)
		this.svgElem.appendChild(this.guideElem)

		const area = rect({ x: this.styles.yAxis.width, y: 0, width: width - this.styles.yAxis.width, height: height - this.styles.xAxis.height, fill: "transparent" })
		this.svgElem.appendChild(area)
		area.addEventListener("mousemove", (event: MouseEvent) => this.onMouseMove(event))
		area.addEventListener("mouseleave", (event: MouseEvent) => this.onMouseLeave(event))
	}

	private axes(x: number, y: number, width: number, height: number): SVGElement {
		return g({ class: "axes", transform: `translate(${x}, ${y})` },
			this.xAxis(this.styles.yAxis.width, height - this.styles.xAxis.height, width - this.styles.yAxis.width, this.styles.xAxis.height),
			this.yAxis(0, 0, this.styles.yAxis.width, height - this.styles.xAxis.height)
		)
	}

	private xAxis = (x: number, y: number, width: number, height: number): SVGElement =>
		g({ class: "xaxis" },
			line({ from: [x, y], to: [x + width, y], stroke: "white" }),
			...this.xaxis.getTicks(Math.floor(width / this.styles.xAxis.labelSpacing)).map(step => text({
				x: x + step.getPos(...this.xaxis.range) * width,
				y: y + 20,
				transform: `rotate(${this.styles.xAxis.labelRotation})`,
				"text-anchor": textAnchorForLabelRotation(this.styles.xAxis.labelRotation),
				style: `transform-origin: ${transformOriginForLabelRotation(this.styles.xAxis.labelRotation)}`,
			}, new Text(step.text)))
		)

	private yAxis = (x: number, y: number, width: number, height: number): SVGElement =>
		g({ class: "yaxis" },
			line({ from: [x + width, y], to: [x + width, y + height], stroke: "white" }),
			...this.yaxis.getTicks(Math.floor(height / this.styles.yAxis.labelSpacing)).map(step => text({
				x: x + width - 10,
				y: y + (1 - step.getPos(...this.yaxis.range)) * height + 5,
				transform: `rotate(${this.styles.yAxis.labelRotation})`,
				"text-anchor": "end",
				style: "transform-origin: right",
			}, new Text(step.text)))
		)

	private grid = (x: number, y: number, width: number, height: number): SVGElement =>
		g({ class: "grid", transform: `translate(${x}, ${y})` },
			...this.xaxis.getTicks(Math.floor(width / this.styles.xAxis.labelSpacing)).map(step => line({
				from: [step.getPos(...this.xaxis.range) * width, 0],
				to: [step.getPos(...this.xaxis.range) * width, height],
				stroke: this.styles.grid.stroke
			})),
			...this.yaxis.getTicks(Math.floor(height / this.styles.yAxis.labelSpacing)).map(step => line({
				from: [0, (1 - step.getPos(...this.yaxis.range)) * height],
				to: [width, (1 - step.getPos(...this.yaxis.range)) * height],
				stroke: this.styles.grid.stroke
			})),
		)

	private lines = (x: number, y: number, width: number, height: number): SVGElement =>
		g({ class: "lines", transform: `translate(${x}, ${y})`, "stroke-width": this.styles.lines.width },
			...this.data.map(({ name, colour, points: values }, i) => {
				const points = values.map(point => [
					point.label.getPos(...this.xaxis.range) * width,
					(1 - point.value.getPos(...this.yaxis.range)) * height
				] as [number, number])
				return polyline({ points, fill: "none", stroke: colour })
			})
		)

	private guide = (height: number): SVGElement =>
		g({ class: "guide", transform: `translate(${this.styles.yAxis.width}, 0)` },
			line({ class: "guideline", from: [0, 0], to: [0, height], stroke: this.styles.guideline.stroke, "stroke-width": this.styles.guideline.width }),
			...this.data.map(() => circle({ class: "guide-point", cx: 0, cy: 0, r: this.styles.guideline.points.r, fill: this.styles.guideline.points.fill })),
		)

	private onMouseMove(event: MouseEvent) {
		const rect = this.svgElem.getBoundingClientRect()
		const x = event.clientX - rect.left

		const points = this.popupElem.update(
			event.clientX, event.clientY,
			(x - this.styles.yAxis.width) / (rect.width - this.styles.yAxis.width),
			this.xaxis.range,
			this.data
		)

		this.guideElem.querySelectorAll(".guide-point").forEach((point, i) => {
			point.setAttribute("cy", ((1 - points[i].value.getPos(...this.yaxis.range)) * (rect.height - this.styles.xAxis.height)).toString())
		})

		this.guideElem.setAttribute("transform", `translate(${x}, 0)`)
		this.guideElem.classList.add("active")
	}

	private onMouseLeave(event: MouseEvent) {
		this.popupElem.hide()
		this.guideElem.classList.remove("active")
	}
}

customElements.define("svg-graph", SVGraph)

const textAnchorForLabelRotation = (rotation: number): "start" | "middle" | "end" =>
	rotation < 0 ? "end" : rotation > 0 ? "start" : "middle"

const transformOriginForLabelRotation = (rotation: number): "left" | "center" | "right" =>
	rotation < 0 ? "right" : rotation > 0 ? "left" : "center"

const getColour = (colourscheme: string[], i: number) => colourscheme[Math.floor(i * colourscheme.length)]

function getAxis<L extends Label>(data: { name: string, colour: string, points: Point[] }[], key: string): Axis<L> {
	const range: [Label, Label] = [
		data.map(({ points }) => points.minBy(p => p[key].number)[key]).minByKey("number"),
		data.map(({ points }) => points.maxBy(p => p[key].number)[key]).maxByKey("number"),
	]

	return new range[0].axisType(range)
}

const style = `
.popup {
	position: absolute;
	padding: 10px;
	background: #2228;
	border: 1px solid #FFF1;
	border-radius: 10px;
	box-shadow: 1px 2px 20px 0px #0008;
	backdrop-filter: blur(20px);
}
.popup h3 {
	margin: 0 0 0.6em 0;
}
.popup p {
	margin: 0.3em 0 0 0;
}
.popup .swatch {
	display: inline-block;
	width: 0.6em;
	height: 0.6em;
	margin-right: 0.5em;
	border-radius: 50%;
}
.popup .name {
	font-family: monospace;
	font-size: 1.2em;
	font-weight: bold;
}

.popup:not(.active) {
	display: none;
}
.guide:not(.active) {
	display: none;
}
	
.xaxis text, .yaxis text {
	transform-box: fill-box;
}`

declare global {
	interface Array<T> {
		max(): T
		maxBy(fn: (x: T) => number): T
		maxByKey(key: string): T
		min(): T
		minBy(fn: (x: T) => number): T
		minByKey(key: string): T
	}
}

Array.prototype.max = function () { return this.reduce((a, b) => Math.max(a, b), 0) }
Array.prototype.maxBy = function <T>(fn: (x: T) => number) { return this.reduce((a, b) => fn(a) > fn(b) ? a : b) }
Array.prototype.maxByKey = function (key: string) { return this.reduce((a, b) => a[key] > b[key] ? a : b) }

Array.prototype.min = function () { return this.reduce((a, b) => Math.min(a, b), 0) }
Array.prototype.minBy = function <T>(fn: (x: T) => number) { return this.reduce((a, b) => fn(a) < fn(b) ? a : b) }
Array.prototype.minByKey = function (key: string) { return this.reduce((a, b) => a[key] < b[key] ? a : b) }
