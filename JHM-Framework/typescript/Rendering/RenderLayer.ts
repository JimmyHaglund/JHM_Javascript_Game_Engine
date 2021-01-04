class RenderLayer implements IRenderLayer {
    private _renderables: IRenderable[] = [];

    constructor(label: string = "background") { }

    public addRenderable(renderable: IRenderable): void {

        this._renderables.push(renderable);
    }

    public removeRenderable(renderable: IRenderable): void {
        let index = this._renderables.indexOf(renderable);
        if (index == -1) return;
        this._renderables.splice(index, 1);
    }

    public render(context: CanvasRenderingContext2D, offsetX: number, offsetY: number, viewRect: Rect): void {
        this._renderables.forEach((renderable) => {
            renderable.render(context, offsetX, offsetY);
        });
    }
}