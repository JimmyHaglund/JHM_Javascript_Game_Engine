declare class RenderLayer implements IRenderLayer {
    private _renderables;
    constructor(label?: string);
    addRenderable(renderable: IRenderable): void;
    removeRenderable(renderable: IRenderable): void;
    render(context: CanvasRenderingContext2D, offsetX: number, offsetY: number, viewRect: Rect): void;
}
