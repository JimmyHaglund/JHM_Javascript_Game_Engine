interface IRenderable extends IDestroyable {
    render(renderContext: CanvasRenderingContext2D, offsetX:number, offsetY:number):void;
}