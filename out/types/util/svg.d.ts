type stringable = string | number | boolean;
type DefaultAttrs = {
    id?: string;
    class?: string;
    style?: string;
    transform?: string;
    fill?: string;
    stroke?: string;
    "stroke-width"?: stringable;
    "font-size"?: stringable;
    visibility?: "visible" | "hidden";
    [_: `data-${string}`]: string;
};
export declare const svg: (attrs: {
    width: string;
    height: string;
    viewBox?: string;
    preserveAspectRatio?: string;
    overflow?: string;
} & DefaultAttrs, ...children: Node[]) => SVGElement;
export declare const circle: (attrs: {
    cx: stringable;
    cy: stringable;
    r: stringable;
} & DefaultAttrs, ...children: Node[]) => SVGCircleElement;
export declare const g: (attrs?: DefaultAttrs, ...children: Node[]) => SVGGElement;
export declare const line: (attrs: {
    from: [stringable, stringable];
    to: [stringable, stringable];
} & DefaultAttrs, ...children: Node[]) => SVGLineElement;
export declare const polyline: (attrs: {
    points: [number, number][];
} & DefaultAttrs, ...children: Node[]) => SVGPolylineElement;
export declare const rect: (attrs: {
    x?: stringable;
    y?: stringable;
    width: stringable;
    height: stringable;
    rx?: stringable;
    ry?: stringable;
} & DefaultAttrs, ...children: Node[]) => SVGRectElement;
export declare const text: (attrs: {
    x: stringable;
    y: stringable;
    dx?: stringable;
    dy?: stringable;
    rotate?: number[];
    lengthAdjust?: string;
    textLength?: stringable;
    "text-anchor"?: "start" | "middle" | "end";
} & DefaultAttrs, ...children: Node[]) => SVGTextElement;
export {};
