import { turbo } from "./colourschemes"
import { div } from "./html"
import { Label, NumberLabel } from "./label"
import PopupElement from "./popup"
import { g, line, polyline, rect, svg, text } from "./svg"

export { Label, NumberLabel } from "./label"

export type Config = {
	data: { [category: string]: number[] }
	xLabels?: Label[]
	yLabels?: Label[]
	styles?: Styles
}

export type Styles = {
	xAxisSize?: number
	yAxisSize?: number
	minSpacePerXLabel?: number
	minSpacePerYLabel?: number
}

export default class SVGraph extends HTMLElement {
	svgElem: SVGElement
	popupElem: PopupElement
	guideLine: SVGElement

	data: { name: string, values: number[] }[]
	xLabels: Label[]
	yLabels: Label[]
	styles: Styles

	maxX: number
	maxY: number
	private resizeObserver: ResizeObserver

	private getXLabelInterval = (width: number): number =>
		Math.ceil(this.xLabels.length / (width / this.styles.minSpacePerXLabel))

	private getYLabelInterval = (height: number): number =>
		Math.ceil(this.yLabels.length / (height / this.styles.minSpacePerYLabel))

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
				margin: 0 0 0.8em 0;
			}
			.popup p {
				margin: 0.5em 0 0 0;
			}
			
			.popup:not(.active) {
				display: none;
			}
			.guideline:not(.active) {
				display: none;
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
		this.data = Object.entries(data).sort((a, b) => b[1].max() - a[1].max()).map(([name, values]) => ({ name, values }))

		this.maxX = this.data.map(({ values }) => values.length - 1).max()
		this.maxY = this.data[0].values.max()

		this.xLabels = xLabels ?? new Set(this.data.flatMap(({ values }) => values.keys().toArray()))
			.values().toArray().sort((a, b) => a - b).map((i) => new NumberLabel(i))
		this.yLabels = yLabels ?? [new NumberLabel(0), new NumberLabel(this.maxY)]

		this.styles = {
			xAxisSize: style?.xAxisSize ?? 30,
			yAxisSize: style?.yAxisSize ?? 30,
			minSpacePerXLabel: style?.minSpacePerXLabel ?? 50,
			minSpacePerYLabel: style?.minSpacePerYLabel ?? 50,
		}

		if (redraw) this.draw(this.svgElem.clientWidth, this.svgElem.clientHeight)
	}

	draw(width: number, height: number) {
		this.svgElem.innerHTML = ""

		this.svgElem.appendChild(this.grid(this.styles.yAxisSize, 0, width - this.styles.yAxisSize, height - this.styles.xAxisSize))
		this.svgElem.appendChild(this.guideLine)
		this.guideLine.setAttribute("y2", (height - this.styles.xAxisSize).toString())
		this.svgElem.appendChild(this.axes(0, 0, width, height))
		this.svgElem.appendChild(this.lines(this.styles.yAxisSize, 0, width - this.styles.yAxisSize, height - this.styles.xAxisSize))

		const area = rect({ x: this.styles.yAxisSize, y: 0, width: width - this.styles.yAxisSize, height: height - this.styles.xAxisSize, fill: "transparent" })
		this.svgElem.appendChild(area)
		area.addEventListener("mousemove", (event: MouseEvent) => this.onMouseMove(event))
		area.addEventListener("mouseleave", (event: MouseEvent) => this.onMouseLeave(event))
	}

	private axes(x: number, y: number, width: number, height: number): SVGElement {
		return g({ class: "axes", transform: `translate(${x}, ${y})` },
			this.xAxis(this.styles.yAxisSize, height - this.styles.xAxisSize, width - this.styles.yAxisSize, this.styles.xAxisSize),
			this.yAxis(0, 0, this.styles.yAxisSize, height - this.styles.xAxisSize)
		)
	}

	private xAxis = (x: number, y: number, width: number, height: number): SVGElement =>
		g({ class: "xaxis" },
			line({ from: [x, y], to: [x + width, y], stroke: "white" }),
			...this.getXLabels(width).map(step => text({
				x: x + step.getPos(this.maxX) * width,
				y: y + 20,
				"text-anchor": "middle"
			}, new Text(step.text)))
		)

	private yAxis = (x: number, y: number, width: number, height: number): SVGElement =>
		g({ class: "yaxis" },
			line({ from: [x + width, y], to: [x + width, y + height], stroke: "white" }),
			...this.getYLabels(height).map(step => text({
				x: x + width - 10,
				y: y + (1 - step.getPos(this.maxY)) * height + 5,
				"text-anchor": "end"
			}, new Text(step.text)))
		)

	private grid = (x: number, y: number, width: number, height: number): SVGElement =>
		g({ class: "grid", transform: `translate(${x}, ${y})` },
			...this.getXLabels(width).map(step => line({
				from: [step.getPos(this.maxX) * width, 0],
				to: [step.getPos(this.maxX) * width, height],
				stroke: "#FFF4"
			})),
			...this.getYLabels(height).map(step => line({
				from: [0, (1 - step.getPos(this.maxY)) * height],
				to: [width, (1 - step.getPos(this.maxY)) * height],
				stroke: "#FFF4"
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

	private onMouseMove(event: MouseEvent) {
		const rect = this.getBoundingClientRect()
		const x = event.clientX - rect.left
		
		this.popupElem.update(event.clientX, event.clientY, Math.round((x - this.styles.yAxisSize) / (rect.width - this.styles.yAxisSize) * this.maxX), this.data)

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

declare global {
	interface Array<T> {
		max(): number
		min(): number
	}
}

Array.prototype.max = function () { return this.reduce((a, b) => Math.max(a, b), 0) }
Array.prototype.min = function () { return this.reduce((a, b) => Math.min(a, b), 0) }