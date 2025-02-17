const ns = "http://www.w3.org/2000/svg"

function element(name: string, attrs: { [key: string]: any }, children: Node[] = []): SVGElement {
	const elem = document.createElementNS(ns, name)
	for (const key in attrs) {
		if (attrs[key] !== undefined) elem.setAttribute(key, attrs[key])
	}
	for (const child of children ?? []) elem.appendChild(child)
	return elem
}

type stringable = string | number | boolean

type DefaultAttrs = {
	id?: string
	class?: string
	style?: string
	transform?: string
	fill?: string
	stroke?: string
	"stroke-width"?: stringable
	"font-size"?: stringable
	visibility?: "visible" | "hidden"
	[_: `data-${string}`]: string
}

export const svg = (attrs: { width: string, height: string, viewBox?: string, preserveAspectRatio?: string, overflow?: string } & DefaultAttrs, ...children: Node[]) =>
	element("svg", { ...attrs, xmlns: ns }, children) as SVGElement

export const circle = (attrs: { cx: stringable, cy: stringable, r: stringable } & DefaultAttrs, ...children: Node[]) =>
	element("circle", attrs, children) as SVGCircleElement

export const g = (attrs: DefaultAttrs = {}, ...children: Node[]) => element("g", attrs, children) as SVGGElement

export const line = (attrs: { from: [stringable, stringable], to: [stringable, stringable] } & DefaultAttrs, ...children: Node[]) =>
	element("line", { ...attrs, x1: attrs.from[0], y1: attrs.from[1], x2: attrs.to[0], y2: attrs.to[1], from: undefined, to: undefined }, children) as SVGLineElement

export const polyline = (attrs: { points: [number, number][] } & DefaultAttrs, ...children: Node[]) =>
	element("polyline", { ...attrs, points: attrs.points.map(([x, y]) => `${x},${y}`).join(" ") }, children) as SVGPolylineElement

export const rect = (attrs: { x?: stringable, y?: stringable, width: stringable, height: stringable, rx?: stringable, ry?: stringable } & DefaultAttrs, ...children: Node[]) =>
	element("rect", attrs, children) as SVGRectElement

export const text = (attrs: { x: stringable, y: stringable, dx?: stringable, dy?: stringable, rotate?: number[], lengthAdjust?: string, textLength?: stringable, "text-anchor"?: "start" | "middle" | "end" } & DefaultAttrs, ...children: Node[]) =>
	element("text", attrs, children) as SVGTextElement
