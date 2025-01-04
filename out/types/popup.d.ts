import { Label } from "./label";
import { Point } from "./svgraph";
import Range from "./util/range";
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
