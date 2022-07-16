declare class Rect {
    left: number;
    top: number;
    width: number;
    height: number;
    get bottom(): number;
    get right(): number;
    constructor(left: number, top: number, width: number, height: number);
}
