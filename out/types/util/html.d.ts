type DefaultAttrs = {
    id?: string;
    class?: string;
    style?: string;
    hidden?: string;
    [_: `data-${string}`]: string;
};
export declare const div: (attrs?: DefaultAttrs, ...children: Node[]) => HTMLElement;
export declare const p: (attrs?: DefaultAttrs, ...children: Node[]) => HTMLElement;
export declare const span: (attrs?: DefaultAttrs, ...children: Node[]) => HTMLElement;
export declare const h1: (attrs?: DefaultAttrs, ...children: Node[]) => HTMLElement;
export declare const h2: (attrs?: DefaultAttrs, ...children: Node[]) => HTMLElement;
export declare const h3: (attrs?: DefaultAttrs, ...children: Node[]) => HTMLElement;
export {};
