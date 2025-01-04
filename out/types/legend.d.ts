export default class LegendElement extends HTMLElement {
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
