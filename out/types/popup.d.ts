import Range from "./util/range";
import { Point } from "./svgraph";
import { Label } from "./label";
export default class PopupElement extends HTMLElement {
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
