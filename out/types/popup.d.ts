import { Dataset, Point } from "./svgraph";
import { Label } from "./label";
export default class PopupElement extends HTMLElement {
    constructor();
    show(): void;
    hide(): void;
    move(x: number, y: number, anchor?: 'left' | 'right'): void;
    update(x: number, y: number, t: number, rect: DOMRect, label: Label, data: Dataset[], points: Point[]): void;
    private setValues;
}
