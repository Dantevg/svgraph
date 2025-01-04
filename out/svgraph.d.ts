declare class Range<T extends number | {
    number: number;
}> {
    min: T;
    max: T;
    constructor(min: T, max: T);
    /**
     * The unit range [0,1]
     */
    static UNIT: Range<number>;
    /**
     * The span of this range, i.e. `max - min`
     */
    get span(): number;
    /**
     * Returns whether a value is within this range
     */
    contains: (value: T) => boolean;
    /**
     * Clamps a value to this range
     */
    clamp: (value: number) => number;
    /**
     * Normalizes a value in a given [min,max] range to [0,1]
     */
    normalize: (value: number) => number;
    /**
     * Interpolates a `t` in [0,1] to a given [min,max] range
     */
    lerp: (t: number) => number;
}

declare class NumberLabel implements Label {
    value: number;
    constructor(value: number);
    get text(): string;
    get number(): number;
    get axisType(): typeof NumberAxis;
    getPos: (range: Range<Label>) => number;
}
declare class NumberAxis implements Axis<NumberLabel> {
    range: Range<NumberLabel>;
    constructor(range: Range<NumberLabel>);
    getTicks(n: number): NumberLabel[];
}

declare class DateLabel implements Label {
    value: Date;
    constructor(value: Date);
    get text(): string;
    get number(): number;
    get axisType(): typeof DateAxis;
    getPos: (range: Range<Label>) => number;
}
declare class DateAxis implements Axis<DateLabel> {
    range: Range<DateLabel>;
    constructor(range: Range<DateLabel>);
    getTicks(n: number): DateLabel[];
}

declare class TimeLabel implements Label {
    value: number;
    constructor(value: number);
    get text(): string;
    get number(): number;
    get axisType(): typeof TimeAxis;
    getPos: (range: Range<Label>) => number;
}
declare class TimeAxis implements Axis<TimeLabel> {
    range: Range<TimeLabel>;
    constructor(range: Range<TimeLabel>);
    getTicks(n: number): TimeLabel[];
}

declare class MetricLabel implements Label {
    value: number;
    unit: string;
    constructor(value: number, unit: string);
    get text(): string;
    get number(): number;
    get axisType(): typeof MetricAxis;
    getPos: (range: Range<Label>) => number;
    static units: string[];
    static unitsStartOffset: number;
    static largestOffset: (value: number) => number;
}
declare class MetricAxis implements Axis<MetricLabel> {
    range: Range<MetricLabel>;
    constructor(range: Range<MetricLabel>);
    getTicks: (n: number) => MetricLabel[];
}

interface Label {
    get text(): string;
    get number(): number;
    get axisType(): any;
    getPos(range: Range<Label>): number;
}
interface Axis<L extends Label> {
    range: Range<L>;
    getTicks(n: number): L[];
}

type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;

declare class PopupElement extends HTMLElement {
    constructor();
    show(): void;
    hide(): void;
    move(x: number, y: number): void;
    update(x: number, y: number, t: number, range: Range<Label>, data: {
        name: string;
        colour: string;
        points: Point[];
    }[]): Point[];
    private setValues;
}

declare class LegendElement extends HTMLElement {
    private callback;
    lines: {
        name: string;
        colour: string;
    }[];
    disabled: Set<string>;
    constructor(callback: () => void);
    update(data: {
        name: string;
        colour: string;
    }[]): void;
    private onLegendItemClick;
}

type Point = {
    label: Label;
    value: Label;
};
type Config = {
    data: {
        [category: string]: Point[];
    };
    styles?: DeepPartial<Styles>;
    title?: string;
};
type AxisStyle = {
    colour: string;
    strokeWidth: number;
    labels: {
        spacing: number;
        rotation: number;
        colour: string;
        fontSize: string;
    };
};
type Styles = {
    colourscheme: string[];
    xAxis: AxisStyle & {
        height: number;
    };
    yAxis: AxisStyle & {
        width: number;
    };
    grid: {
        stroke: string;
    };
    guideline: {
        stroke: string;
        width: number;
        points: {
            r: number;
            fill: string;
        };
    };
    lines: {
        width: number;
    };
};
declare class SVGraph extends HTMLElement {
    svgElem: SVGElement;
    popupElem: PopupElement;
    legendElem: LegendElement;
    guideElem: SVGElement;
    selectionElem: SVGElement;
    data: {
        name: string;
        colour: string;
        points: Point[];
    }[];
    styles: Styles;
    xaxis: Axis<Label>;
    yaxis: Axis<Label>;
    private resizeObserver;
    private selection;
    private activeData;
    get canvasCoordRange(): Range<number>;
    constructor(config: Config);
    update({ data, title, styles }: Config, redraw?: boolean): void;
    draw(width: number, height: number): void;
    selectRange(from: Label, to: Label, redraw?: boolean): void;
    private updateActiveData;
    private axes;
    private xAxis;
    private yAxis;
    private grid;
    private lines;
    private selectionOverlay;
    private guide;
    private onMouseDown;
    private onMouseUp;
    private onMouseMove;
    private onMouseLeave;
    private handleSelection;
    private handleHover;
    private isWithinGraphArea;
}

export { type Config, DateLabel, type Label, MetricLabel, NumberLabel, type Point, type Styles, TimeLabel, SVGraph as default };
