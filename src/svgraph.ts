import { circle, g, line, polyline, rect, svg, text } from "./util/svg"
import { h1 } from "./util/html"
import Range from "./util/range"
import { DeepPartial, maxBy, minBy, nearestLabel, nearestPointForLabel } from "./util/util"
import { Label, Axis } from "./label"
import PopupElement from "./popup"
import LegendElement from "./legend"
import { EmptyAxis } from "./labeltypes/empty"
import style from "./style"

export { Label } from "./label"
export { NumberLabel } from "./labeltypes/number"
export { IntegerLabel } from "./labeltypes/integer"
export { DateLabel } from "./labeltypes/date"
export { TimeLabel } from "./labeltypes/time"
export { MetricLabel } from "./labeltypes/metric"
export { EmptyLabel } from "./labeltypes/empty"

export type Point = { label: Label, value: Label }

export type Config = {
	data: { [category: string]: Point[] }
	styles?: DeepPartial<Styles>
	title?: string
}

type AxisStyle = {
	colour: string
	strokeWidth: number
	labels: {
		spacing: number
		rotation: number
		colour: string
		fontSize: string
	}
}

export type Styles = {
	colourscheme: string[]
	xAxis: AxisStyle & { height: number }
	yAxis: AxisStyle & { width: number }
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

export type Dataset = {
	name: string
	colour: string
	points: Point[]
}

export default class SVGraph extends HTMLElement {
	svgElem: SVGElement
	popupElem: PopupElement
	legendElem: LegendElement
	guideElem: SVGElement
	selectionElem: SVGElement

	data: Dataset[]
	styles: Styles
	xaxis: Axis<Label>
	yaxis: Axis<Label>

	private resizeObserver: ResizeObserver
	private selection: { from?: number, to?: number } = {}
	private activeData: Dataset[]

	get canvasCoordRange() { return new Range(this.styles.yAxis.width, this.svgElem.clientWidth) }

	constructor(config: Config) {
		super()

		const shadow = this.attachShadow({ mode: "open" })

		const styleElem = document.createElement("style")
		styleElem.textContent = style
		shadow.appendChild(styleElem)

		shadow.appendChild(h1({ id: "title" }))

		this.legendElem = new LegendElement(() => this.updateActiveData())
		shadow.appendChild(this.legendElem)

		this.svgElem = svg({ width: "100%", height: "100%", overflow: "visible", fill: "white" })
		this.svgElem.addEventListener("mousedown", (event: MouseEvent) => this.onMouseDown(event))
		this.svgElem.addEventListener("mouseup", (event: MouseEvent) => this.onMouseUp(event))
		this.svgElem.addEventListener("mousemove", (event: MouseEvent) => this.onMouseMove(event))
		this.svgElem.addEventListener("mouseleave", (event: MouseEvent) => this.onMouseLeave(event))
		shadow.appendChild(this.svgElem)

		this.popupElem = new PopupElement()
		shadow.appendChild(this.popupElem)

		this.update(config, false)
	}

	// Callback for when the element is added to the DOM
	private connectedCallback() {
		this.resizeObserver = new ResizeObserver((entries) => {
			const { inlineSize: width, blockSize: height } = entries[0].contentBoxSize[0]
			if (width > 0 && height > 0) this.draw(width, height)
		})
		this.resizeObserver.observe(this.svgElem, { box: "content-box" })
	}

	update({ data, title, styles }: Config, redraw = true) {
		this.styles = {
			colourscheme: styles?.colourscheme ?? ["black"],
			xAxis: {
				height: styles?.xAxis?.height ?? 30,
				colour: styles?.xAxis?.colour ?? "white",
				strokeWidth: styles?.xAxis?.strokeWidth ?? 1,
				labels: {
					spacing: styles?.xAxis?.labels?.spacing ?? 30,
					rotation: styles?.xAxis?.labels?.rotation ?? 0,
					colour: styles?.xAxis?.labels?.colour ?? styles?.xAxis?.colour ?? "#FFF8",
					fontSize: styles?.xAxis?.labels?.fontSize ?? "0.8em",
				},
			},
			yAxis: {
				width: styles?.yAxis?.width ?? 30,
				colour: styles?.yAxis?.colour ?? "white",
				strokeWidth: styles?.yAxis?.strokeWidth ?? 1,
				labels: {
					spacing: styles?.yAxis?.labels?.spacing ?? 50,
					rotation: styles?.yAxis?.labels?.rotation ?? 0,
					colour: styles?.yAxis?.labels?.colour ?? styles?.yAxis?.colour ?? "#FFF8",
					fontSize: styles?.yAxis?.labels?.fontSize ?? "0.8em",
				},
			},
			grid: {
				stroke: styles?.grid?.stroke ?? "#FFF2",
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
			.sort((a, b) => (b[1].at(-1)?.value?.valueOf() ?? 0) - (a[1].at(-1)?.value?.valueOf() ?? 0))
			.map(([name, points], i, arr) => ({ name, points, colour: getColour(this.styles.colourscheme, (i + 1) / (arr.length + 1)) }))

		this.xaxis = getAxis(this.data, "label")
		this.yaxis = getAxis(this.data, "value")
		this.legendElem.update(this.data)

		this.shadowRoot.getElementById("title").textContent = title

		this.updateActiveData(redraw)
	}

	draw(width: number, height: number) {
		this.svgElem.innerHTML = ""

		this.svgElem.appendChild(this.grid(this.styles.yAxis.width, 0, width - this.styles.yAxis.width, height - this.styles.xAxis.height))
		this.svgElem.appendChild(this.lines(this.styles.yAxis.width, 0, width - this.styles.yAxis.width, height - this.styles.xAxis.height))
		this.svgElem.appendChild(this.axes(0, 0, width, height))

		this.guideElem = this.guide(height - this.styles.xAxis.height)
		this.svgElem.appendChild(this.guideElem)

		this.selectionElem = this.selectionOverlay(this.styles.yAxis.width, 0, width - this.styles.yAxis.width, height - this.styles.xAxis.height)
		this.svgElem.appendChild(this.selectionElem)
	}

	selectRange(from: Label, to: Label, redraw = true) {
		this.xaxis.range = new Range(from, to)
		this.updateActiveData(false)

		if (this.activeData.length == 0) {
			// selection has no data, reset zoom
			this.xaxis = getAxis(this.data, "label")
			this.updateActiveData(false)
		}

		if (redraw) this.draw(this.svgElem.clientWidth, this.svgElem.clientHeight)
	}

	private updateActiveData(redraw = true) {
		const newActiveData = this.data
			.filter(({ name }) => !this.legendElem.disabled.has(name))
			.map(({ name, colour, points }) => ({
				name, colour, points: points.filter(({ label }, i, arr) =>
					this.xaxis.range.contains(label)
					|| (arr[i - 1] && this.xaxis.range.contains(arr[i - 1].label))
					|| (arr[i + 1] && this.xaxis.range.contains(arr[i + 1].label))
				)
			})).filter(({ points }) => points.length > 0)

		this.activeData = newActiveData

		this.yaxis = getAxis(this.activeData, "value")

		if (redraw) this.draw(this.svgElem.clientWidth, this.svgElem.clientHeight)
	}

	private axes(x: number, y: number, width: number, height: number): SVGElement {
		return g({ class: "axes", transform: `translate(${x}, ${y})` },
			this.xAxis(this.styles.yAxis.width, height - this.styles.xAxis.height, width - this.styles.yAxis.width, this.styles.xAxis.height),
			this.yAxis(0, 0, this.styles.yAxis.width, height - this.styles.xAxis.height)
		)
	}

	private xAxis = (x: number, y: number, width: number, height: number): SVGElement =>
		g({ class: "xaxis" },
			line({
				from: [x - this.styles.yAxis.strokeWidth, y + this.styles.xAxis.strokeWidth / 2],
				to: [x + width, y + this.styles.xAxis.strokeWidth / 2],
				stroke: this.styles.xAxis.colour,
				"stroke-width": this.styles.xAxis.strokeWidth
			}),
			...this.xaxis.getTicks(Math.floor(width / this.styles.xAxis.labels.spacing)).map(step => text({
				class: "tick-label",
				x: x + this.xaxis.range.normalize(step) * width,
				y: y + 20,
				transform: `rotate(${this.styles.xAxis.labels.rotation})`,
				"text-anchor": textAnchorForLabelRotation(this.styles.xAxis.labels.rotation),
				style: `transform-origin: ${transformOriginForLabelRotation(this.styles.xAxis.labels.rotation)}`,
				fill: this.styles.xAxis.labels.colour,
				"font-size": this.styles.xAxis.labels.fontSize,
			}, new Text(step.text)))
		)

	private yAxis = (x: number, y: number, width: number, height: number): SVGElement =>
		g({ class: "yaxis" },
			line({
				from: [x + width - this.styles.yAxis.strokeWidth / 2, y],
				to: [x + width - this.styles.yAxis.strokeWidth / 2, y + height],
				stroke: this.styles.yAxis.colour,
				"stroke-width": this.styles.yAxis.strokeWidth
			}),
			...this.yaxis.getTicks(Math.floor(height / this.styles.yAxis.labels.spacing)).map(step => text({
				class: "tick-label",
				x: x + width - 10,
				y: y + (1 - this.yaxis.range.normalize(step)) * height + 5,
				transform: `rotate(${this.styles.yAxis.labels.rotation})`,
				"text-anchor": "end",
				style: "transform-origin: right",
				fill: this.styles.yAxis.labels.colour,
				"font-size": this.styles.yAxis.labels.fontSize,
			}, new Text(step.text)))
		)

	private grid = (x: number, y: number, width: number, height: number): SVGElement =>
		g({ class: "grid", transform: `translate(${x}, ${y})` },
			...this.xaxis.getTicks(Math.floor(width / this.styles.xAxis.labels.spacing)).map(step => line({
				class: "gridline-v",
				from: [this.xaxis.range.normalize(step) * width, 0],
				to: [this.xaxis.range.normalize(step) * width, height],
				stroke: this.styles.grid.stroke
			})),
			...this.yaxis.getTicks(Math.floor(height / this.styles.yAxis.labels.spacing)).map(step => line({
				class: "gridline-h",
				from: [0, (1 - this.yaxis.range.normalize(step)) * height],
				to: [width, (1 - this.yaxis.range.normalize(step)) * height],
				stroke: this.styles.grid.stroke
			})),
		)

	private lines = (x: number, y: number, width: number, height: number): SVGElement =>
		g({ class: "lines", transform: `translate(${x}, ${y})`, "stroke-width": this.styles.lines.width },
			...this.activeData.map(({ name, colour, points: values }, i) => {
				const points = values.map(point => [
					Range.UNIT.clamp(this.xaxis.range.normalize(point.label)) * width,
					Range.UNIT.clamp((1 - this.yaxis.range.normalize(point.value))) * height,
				] as [number, number])
				return polyline({ "data-name": name, points, fill: "none", stroke: colour })
			})
		)

	private selectionOverlay = (x: number, y: number, width: number, height: number): SVGElement =>
		rect({ class: "selection-overlay", x: x, y: y, width: 0, height: height, fill: "#46A4" })

	private guide = (height: number): SVGElement =>
		g({ class: "guide", transform: `translate(${this.styles.yAxis.width}, 0)`, visibility: "hidden" },
			line({ class: "guideline", from: [0, 0], to: [0, height], stroke: this.styles.guideline.stroke, "stroke-width": this.styles.guideline.width }),
			...this.activeData.map(() => circle({ class: "guide-point", cx: 0, cy: 0, r: this.styles.guideline.points.r, fill: this.styles.guideline.points.fill })),
		)

	private onMouseDown(event: MouseEvent) {
		if (this.isWithinGraphArea(event.clientX, event.clientY)) {
			this.selection = { from: Range.UNIT.clamp(this.canvasCoordRange.normalize(event.clientX - this.svgElem.getBoundingClientRect().left)) }
		}
	}

	private onMouseUp(event: MouseEvent) {
		if (this.selection.from != undefined) {
			this.selectRange(
				nearestLabel(Math.min(this.selection.from, this.selection.to), this.xaxis.range, this.activeData),
				nearestLabel(Math.max(this.selection.from, this.selection.to), this.xaxis.range, this.activeData)
			)
		}

		this.selection = {}
		this.selectionElem.setAttribute("width", "0")
	}

	private onMouseMove(event: MouseEvent) {
		const svgRect = this.svgElem.getBoundingClientRect()
		const shadowRect = this.shadowRoot.host.getBoundingClientRect()
		const t = this.canvasCoordRange.normalize(event.clientX - svgRect.left)

		if (this.isWithinGraphArea(event.clientX, event.clientY)) {
			this.handleSelection(t, event.buttons)
			this.handleHover(t, event.clientX - shadowRect.left, event.clientY - shadowRect.top, shadowRect, svgRect)
		} else {
			this.popupElem.hide()
			this.guideElem.setAttribute("visibility", "hidden")
		}
	}

	private onMouseLeave(event: MouseEvent) {
		this.popupElem.hide()
		this.guideElem.setAttribute("visibility", "hidden")
	}

	private handleSelection(t: number, buttons: number) {
		if ((buttons & 1) == 1) {
			// primary (left) mouse button pressed
			this.selection.to = Range.UNIT.clamp(t)
		} else {
			this.selection = {}
		}

		if (this.selection.from != undefined && this.selection.to != undefined) {
			this.selectionElem.setAttribute("x", this.canvasCoordRange.lerp(Math.min(this.selection.from, this.selection.to)).toString())
			this.selectionElem.setAttribute("width", (this.canvasCoordRange.lerp(Math.abs(this.selection.to - this.selection.from)) - this.styles.yAxis.width).toString())
		} else {
			this.selectionElem.setAttribute("width", "0")
		}
	}

	private handleHover(t: number, x: number, y: number, shadowRect: DOMRect, svgRect: DOMRect) {
		const label = nearestLabel(t, this.xaxis.range, this.activeData)
		const points = this.activeData.map(({ points }) => nearestPointForLabel(points, label, this.xaxis.range))
		
		this.popupElem.update(x, y, t, shadowRect, label, this.activeData, points)

		this.guideElem.querySelectorAll(".guide-point").forEach((point, i) => {
			point.setAttribute("cy", ((1 - this.yaxis.range.normalize(points[i].value)) * (svgRect.height - this.styles.xAxis.height)).toString())
		})

		this.guideElem.setAttribute("transform", `translate(${this.xaxis.range.normalize(label) * (svgRect.width - this.styles.yAxis.width) + this.styles.yAxis.width}, 0)`)
		this.guideElem.removeAttribute("visibility")
	}

	private isWithinGraphArea(x: number, y: number): boolean {
		const rect = this.svgElem.getBoundingClientRect()
		return new Range(rect.left + this.styles.yAxis.width, rect.right).contains(x)
			&& new Range(rect.top, rect.bottom - this.styles.xAxis.height).contains(y)
	}
}

customElements.define("svg-graph", SVGraph)

const textAnchorForLabelRotation = (rotation: number): "start" | "middle" | "end" =>
	rotation < 0 ? "end" : rotation > 0 ? "start" : "middle"

const transformOriginForLabelRotation = (rotation: number): "left" | "center" | "right" =>
	rotation < 0 ? "right" : rotation > 0 ? "left" : "center"

const getColour = (colourscheme: string[], i: number) => colourscheme[Math.floor(i * colourscheme.length)]

function getAxis(data: { name: string, colour: string, points: Point[] }[], key: keyof Point): Axis<Label> {
	const dataFiltered = data.filter(({ points }) => points.length > 0)
	if (dataFiltered.length == 0) return new EmptyAxis()

	const range = new Range(
		minBy(dataFiltered.map(({ points }) => minBy(points, p => p[key].valueOf())?.[key]), l => l.valueOf()),
		maxBy(dataFiltered.map(({ points }) => maxBy(points, p => p[key].valueOf())?.[key]), l => l.valueOf()),
	)

	return new range.min.axisType(range)
}
