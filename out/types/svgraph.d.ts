import Range from "./util/range";
import { DeepPartial } from "./util/util";
import { Label, Axis } from "./label";
import PopupElement from "./popup";
import LegendElement from "./legend";
export { Label, NumberLabel, DateLabel, TimeLabel, MetricLabel } from "./label";
export type Point = {
    label: Label;
    value: Label;
};
export type Config = {
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
export type Styles = {
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
export default class SVGraph extends HTMLElement {
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
