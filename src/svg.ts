const ns = "http://www.w3.org/2000/svg"

export function element(name: string, attrs: { [key: string]: any }, children: Node[] = []): SVGElement {
	const elem = document.createElementNS(ns, name)
	for (const key in attrs) {
		if (attrs[key] !== undefined) elem.setAttribute(key, attrs[key])
	}
	for (const child of children ?? []) elem.appendChild(child)
	return elem
}

type stringable = string | number | boolean

type DefaultAttrs = {
	class?: string
	transform?: string,
	fill?: string
	stroke?: string
	"stroke-width"?: string
}

export const svg = (attrs: { width: string, height: string, viewBox?: string, preserveAspectRatio?: string, overflow?: string } & DefaultAttrs, ...children: Node[]) =>
	element("svg", { ...attrs, xmlns: ns }, children)

export const g = (attrs: DefaultAttrs = {}, ...children: Node[]) => element("g", attrs, children)

export const line = (attrs: { from: [stringable, stringable], to: [stringable, stringable] } & DefaultAttrs, ...children: Node[]) =>
	element("line", { ...attrs, x1: attrs.from[0], y1: attrs.from[1], x2: attrs.to[0], y2: attrs.to[1], from: undefined, to: undefined }, children)

export const polyline = (attrs: { points: [number, number][] } & DefaultAttrs, ...children: Node[]) =>
	element("polyline", { ...attrs, points: attrs.points.map(([x, y]) => `${x},${y}`).join(" ") }, children)

export const rect = (attrs: { x?: string, y?: string, width: string, height: string, rx?: string, ry?: string } & DefaultAttrs, ...children: Node[]) =>
	element("rect", attrs, children)

export const text = (attrs: { x: stringable, y: stringable, dx?: stringable, dy?: stringable, rotate?: number[], lengthAdjust?: string, textLength?: stringable, "text-anchor"?: "start" | "middle" | "end" } & DefaultAttrs, ...children: Node[]) =>
	element("text", attrs, children)
