interface IRenderable extends IDestroyable {
    Render(renderContext: CanvasRenderingContext2D):void;
}