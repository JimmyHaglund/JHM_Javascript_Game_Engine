interface IRenderLayer {
    addRenderable(renderable: IRenderable);
    removeRenderable(renderable: IRenderable);
    render(context:CanvasRenderingContext2D, offsetX:number, offsetY:number, viewRect:Rect);
}