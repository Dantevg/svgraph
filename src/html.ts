function element(name: string, attrs: { [key: string]: any }, children: Node[] = []): HTMLElement {
	const elem = document.createElement(name)
	for (const key in attrs) {
		if (attrs[key] !== undefined) elem.setAttribute(key, attrs[key])
	}
	for (const child of children ?? []) elem.appendChild(child)
	return elem
}

type DefaultAttrs = {
	id?: string,
	class?: string
}

export const div = (attrs: DefaultAttrs = {}, ...children: Node[]) => element("div", attrs, children)
export const p = (attrs: DefaultAttrs = {}, ...children: Node[]) => element("p", attrs, children)
export const h1 = (attrs: DefaultAttrs = {}, ...children: Node[]) => element("h1", attrs, children)
export const h2 = (attrs: DefaultAttrs = {}, ...children: Node[]) => element("h2", attrs, children)
export const h3 = (attrs: DefaultAttrs = {}, ...children: Node[]) => element("h3", attrs, children)
