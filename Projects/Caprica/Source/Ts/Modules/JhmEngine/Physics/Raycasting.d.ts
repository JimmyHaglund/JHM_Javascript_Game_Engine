declare class RayRender implements IRenderable, IDestroyable {
    private _x1;
    private _y1;
    private _x2;
    private _y2;
    private _color;
    private _onDestroy;
    get onDestroy(): Action;
    constructor(layer: RenderLayer, x0: any, y0: any, lean: any, length?: number, color?: string, duration?: number);
    destroy(): void;
    render(context: CanvasRenderingContext2D): void;
}
