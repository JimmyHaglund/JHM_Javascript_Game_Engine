class Rect {
    public left: number;
    public top: number;
    public width: number;
    public height: number;
    public get bottom(): number { return this.top + this.height };
    public get right(): number { return this.left + this.width };
    constructor(left: number, top: number, width: number, height: number) {
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
    }
}