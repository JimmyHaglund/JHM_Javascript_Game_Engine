interface IRenderLayer {
    addRenderable(renderable: IRenderable): any;
    removeRenderable(renderable: IRenderable): any;
    render(context: CanvasRenderingContext2D, offsetX: number, offsetY: number, viewRect: Rect): any;
}
