declare abstract class Label implements Value {
    abstract value: Value;
    abstract get text(): string;
    abstract get axisType(): {
        new (range: Range<any>): Axis<Label>;
    };
    valueOf(): number;
}
declare abstract class Axis<L extends Label> {
    range: Range<L>;
    constructor(range: Range<L>);
    abstract getTicks(n: number): L[];
}

type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;
/**
 * Any value that can be interpreted as a number.
 *
 * This automatically includes the native `number` type.
 */
type Value = {
    valueOf(): number;
};

declare class Range<T extends Value> {
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
    contains: <U extends T>(value: U) => boolean;
    /**
     * Clamps a value to this range
     */
    clamp: <U extends T>(value: U) => number;
    /**
     * Normalizes a value in this range to [0,1]
     */
    normalize: <U extends T>(value: U) => number;
    /**
     * Interpolates a `t` in [0,1] to this range
     */
    lerp: (t: number) => number;
}

declare class PopupElement extends HTMLElement {
    constructor();
    show(): void;
    hide(): void;
    move(x: number, y: number, anchor?: 'left' | 'right'): void;
    update(x: number, y: number, t: number, rect: DOMRect, label: Label, data: Dataset[], points: Point[]): void;
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

declare class NumberLabel extends Label {
    value: number;
    constructor(value: number);
    get text(): string;
    get axisType(): typeof NumberAxis;
}
declare class NumberAxis extends Axis<NumberLabel> {
    getTicks(n: number): NumberLabel[];
}

declare class IntegerLabel extends Label {
    value: number;
    constructor(value: number);
    get text(): string;
    get axisType(): typeof IntegerAxis;
}
declare class IntegerAxis extends Axis<IntegerLabel> {
    getTicks(n: number): IntegerLabel[];
}

declare class DateLabel extends Label {
    value: Date;
    constructor(value: Date);
    get text(): string;
    get axisType(): typeof DateAxis;
}
declare class DateAxis extends Axis<DateLabel> {
    getTicks(n: number): DateLabel[];
}

declare class TimeLabel extends Label {
    value: number;
    constructor(value: number);
    get text(): string;
    get axisType(): typeof TimeAxis;
}
declare class TimeAxis extends Axis<TimeLabel> {
    getTicks(n: number): TimeLabel[];
}

declare class MetricLabel extends Label {
    value: number;
    unit: string;
    constructor(value: number, unit: string);
    get text(): string;
    get axisType(): typeof MetricAxis;
    static units: string[];
    static unitsStartOffset: number;
    static largestOffset: (value: number) => number;
}
declare class MetricAxis extends Axis<MetricLabel> {
    getTicks: (n: number) => MetricLabel[];
}

declare class EmptyLabel extends Label {
    value: Value;
    constructor();
    get text(): string;
    get axisType(): typeof EmptyAxis;
}
declare class EmptyAxis extends Axis<EmptyLabel> {
    static RANGE: Range<EmptyLabel>;
    constructor(_range?: Range<Label>);
    getTicks(_n: number): EmptyLabel[];
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
type Dataset = {
    name: string;
    colour: string;
    points: Point[];
};
declare class SVGraph extends HTMLElement {
    svgElem: SVGElement;
    popupElem: PopupElement;
    legendElem: LegendElement;
    guideElem: SVGElement;
    selectionElem: SVGElement;
    data: Dataset[];
    styles: Styles;
    xaxis: Axis<Label>;
    yaxis: Axis<Label>;
    private resizeObserver;
    private selection;
    private activeData;
    get canvasCoordRange(): Range<number>;
    constructor(config: Config);
    private connectedCallback;
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

export { type Config, type Dataset, DateLabel, EmptyLabel, IntegerLabel, Label, MetricLabel, NumberLabel, type Point, type Styles, TimeLabel, SVGraph as default };
