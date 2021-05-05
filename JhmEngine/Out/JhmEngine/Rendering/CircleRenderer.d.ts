declare class CircleRenderer implements IRenderable, IDestroyable {
    private _onDestroy;
    private _radius;
    private _color;
    private _transform;
    private _startAngle;
    private _endAngle;
    private _clockWise;
    get onDestroy(): Action;
    constructor(radius: number, transform: Transform, color?: string, startAngle?: number, endAngle?: number, clockwise?: boolean);
    render(context: CanvasRenderingContext2D, viewX: number, viewY: number): void;
    destroy(): void;
}
