import { turbo } from "./colourschemes"
import { Label, NumberLabel } from "./label"
import PopupElement from "./popup"
import { circle, g, line, polyline, rect, svg, text } from "./svg"

export { Label, NumberLabel } from "./label"
export { getData } from "./data"

export type Point = { label: Label, value: number }

export type Config = {
	data: { [category: string]: Point[] }
	xLabels?: Label[]
	yLabels?: Label[]
	styles?: Styles
}

export type Styles = {
	xAxis?: {
		height?: number
		labelSpacing?: number
		labelRotation?: number
	}
	yAxis?: {
		width?: number
		labelSpacing?: number
		labelRotation?: number
	}
}

export default class SVGraph extends HTMLElement {
	svgElem: SVGElement
	popupElem: PopupElement
	guideLine: SVGElement

	guidePoints: SVGCircleElement[]

	data: { name: string, colour: string, points: Point[] }[]
	xLabels: Label[]
	yLabels: Label[]
	styles: Styles

	xRange: [Label, Label]
	maxY: number
	private resizeObserver: ResizeObserver

	private getXLabelInterval = (width: number): number =>
		Math.ceil(this.xLabels.length / (width / this.styles.xAxis.labelSpacing))

	private getYLabelInterval = (height: number): number =>
		Math.ceil(this.yLabels.length / (height / this.styles.yAxis.labelSpacing))

	private getXLabels = (width: number): Label[] => this.xLabels.filter((_, i) => i % this.getXLabelInterval(width) == 0)
	private getYLabels = (height: number): Label[] => this.yLabels.filter((_, i) => i % this.getYLabelInterval(height) == 0)

	constructor(config: Config) {
		super()

		const shadow = this.attachShadow({ mode: "open" })

		const styleElem = document.createElement("style")
		styleElem.textContent = `
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
			.guideline:not(.active) {
				display: none;
			}
			.guideline:not(.active) ~ .guide-point {
				display: none;
			}
				
			.xaxis text, .yaxis text {
				transform-box: fill-box;
			}
		`
		shadow.appendChild(styleElem)

		this.svgElem = svg({ width: "100%", height: "100%", overflow: "visible", fill: "white" })
		shadow.appendChild(this.svgElem)

		this.guideLine = line({ class: "guideline", from: [0, 0], to: [0, 0], stroke: "#FFF8", "stroke-width": 1 })

		this.popupElem = new PopupElement()
		this.popupElem.classList.add("popup")
		shadow.appendChild(this.popupElem)

		this.resizeObserver = new ResizeObserver((entries) => {
			this.draw(entries[0].contentBoxSize[0].inlineSize, entries[0].contentBoxSize[0].blockSize)
		})
		this.resizeObserver.observe(this.svgElem, { box: "content-box" })

		this.update(config, false)
	}

	update({ data, xLabels, yLabels, styles: style }: Config, redraw = true) {
		this.data = Object.entries(data)
			.sort((a, b) => b[1].at(-1).value - a[1].at(-1).value)
			.map(([name, points], i, arr) => ({ name, points, colour: turbo[Math.floor((i + 1) / (arr.length + 1) * turbo.length)] }))

		this.xRange = [
			this.data.map(({ points }) => points[0])[0].label,
			this.data.map(({ points }) => points.at(-1)).at(-1).label,
		]
		this.maxY = this.data[0].points.maxByKey("value").value

		this.xLabels = xLabels ?? new Set(this.data.flatMap(({ points }) => points.map(x => x.label)))
			.values().toArray().sort((a, b) => a.getPos(...this.xRange) - b.getPos(...this.xRange))
		this.yLabels = yLabels ?? [new NumberLabel(0), new NumberLabel(this.maxY)]

		this.styles = {
			xAxis: {
				height: style?.xAxis?.height ?? 30,
				labelSpacing: style?.xAxis?.labelSpacing ?? 50,
				labelRotation: style?.xAxis?.labelRotation ?? 0,
			},
			yAxis: {
				width: style?.yAxis?.width ?? 30,
				labelSpacing: style?.yAxis?.labelSpacing ?? 50,
				labelRotation: style?.yAxis?.labelRotation ?? 0,
			},
		}

		if (redraw) this.draw(this.svgElem.clientWidth, this.svgElem.clientHeight)
	}

	draw(width: number, height: number) {
		this.svgElem.innerHTML = ""

		this.svgElem.appendChild(this.grid(this.styles.yAxis.width, 0, width - this.styles.yAxis.width, height - this.styles.xAxis.height))
		this.svgElem.appendChild(this.guideLine)
		this.guideLine.setAttribute("y2", (height - this.styles.xAxis.height).toString())
		this.svgElem.appendChild(this.axes(0, 0, width, height))
		this.svgElem.appendChild(this.lines(this.styles.yAxis.width, 0, width - this.styles.yAxis.width, height - this.styles.xAxis.height))

		this.guidePoints = this.data.map(() => circle({ class: "guide-point", cx: 0, cy: 0, r: 2, fill: "white" }))
		this.svgElem.append(...this.guidePoints)

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
			...this.getXLabels(width).map(step => text({
				x: x + step.getPos(...this.xRange) * width,
				y: y + 20,
				transform: `rotate(${this.styles.xAxis.labelRotation})`,
				"text-anchor": textAnchorForLabelRotation(this.styles.xAxis.labelRotation),
				style: `transform-origin: ${transformOriginForLabelRotation(this.styles.xAxis.labelRotation)}`,
			}, new Text(step.text)))
		)

	private yAxis = (x: number, y: number, width: number, height: number): SVGElement =>
		g({ class: "yaxis" },
			line({ from: [x + width, y], to: [x + width, y + height], stroke: "white" }),
			...this.getYLabels(height).map(step => text({
				x: x + width - 10,
				y: y + (1 - step.getPos(new NumberLabel(0), new NumberLabel(this.maxY))) * height + 5,
				transform: `rotate(${this.styles.yAxis.labelRotation})`,
				"text-anchor": "end",
				style: "transform-origin: right",
			}, new Text(step.text)))
		)

	private grid = (x: number, y: number, width: number, height: number): SVGElement =>
		g({ class: "grid", transform: `translate(${x}, ${y})` },
			...this.getXLabels(width).map(step => line({
				from: [step.getPos(...this.xRange) * width, 0],
				to: [step.getPos(...this.xRange) * width, height],
				stroke: "#FFF4"
			})),
			...this.getYLabels(height).map(step => line({
				from: [0, (1 - step.getPos(new NumberLabel(0), new NumberLabel(this.maxY))) * height],
				to: [width, (1 - step.getPos(new NumberLabel(0), new NumberLabel(this.maxY))) * height],
				stroke: "#FFF4"
			})),
		)

	private lines = (x: number, y: number, width: number, height: number): SVGElement =>
		g({ class: "lines", transform: `translate(${x}, ${y})`, "stroke-width": "2" },
			...this.data.map(({ name, colour, points: values }, i) => {
				const points = values.map(point => [
					point.label.getPos(...this.xRange) * width,
					(1 - point.value / this.maxY) * height
				] as [number, number])
				return polyline({ points, fill: "none", stroke: colour })
			})
		)

	private onMouseMove(event: MouseEvent) {
		const rect = this.svgElem.getBoundingClientRect()
		const x = event.clientX - rect.left

		const points = this.popupElem.update(
			event.clientX, event.clientY,
			(x - this.styles.yAxis.width) / (rect.width - this.styles.yAxis.width),
			this.xRange,
			this.data
		)

		for (let i = 0; i < points.length; i++) {
			this.guidePoints[i].setAttribute("cx", (points[i].label.getPos(...this.xRange) * (rect.width - this.styles.yAxis.width) + this.styles.yAxis.width).toString())
			this.guidePoints[i].setAttribute("cy", ((1 - points[i].value / this.maxY) * (rect.height - this.styles.xAxis.height)).toString())
		}

		this.guideLine.classList.add("active")
		this.guideLine.setAttribute("x1", x.toString())
		this.guideLine.setAttribute("x2", x.toString())
	}

	private onMouseLeave(event: MouseEvent) {
		this.popupElem.hide()
		this.guideLine.classList.remove("active")
	}
}

customElements.define("svg-graph", SVGraph)

const textAnchorForLabelRotation = (rotation: number): "start" | "middle" | "end" =>
	rotation < 0 ? "end" : rotation > 0 ? "start" : "middle"

const transformOriginForLabelRotation = (rotation: number): "left" | "center" | "right" =>
	rotation < 0 ? "right" : rotation > 0 ? "left" : "center"

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
