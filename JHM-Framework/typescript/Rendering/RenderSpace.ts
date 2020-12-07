class RenderSpace {
    private _layers: { layer: number, renderables: IRenderable[] }[] = [];
    private _canvas: HTMLCanvasElement;
    private _context: CanvasRenderingContext2D;
    private _color: string;

    get canvas(): HTMLCanvasElement { return this._canvas; }
    get width() { return this._canvas.width; }
    set width(value: number) { this.canvas.width = value; }
    set height(value: number) { this.canvas.height = value; }
    get height() { return this._canvas.height; }
    get left() { return parseInt(this._canvas.style.left, 10); }
    set left(value: number) { this._canvas.style.left = value + 'px'; }
    get right() { return parseInt(this._canvas.style.right, 10); }
    set right(value: number) { this._canvas.style.right = value + 'px'; }
    get top() { return parseInt(this._canvas.style.top, 10); }
    set top(value: number) { this._canvas.style.top = value + 'px'; }
    get bottom() { return parseInt(this._canvas.style.bottom, 10); }
    set bottom(value: number) { this._canvas.style.bottom = value + 'px'; }
    set backgroundColor(color: string) { this._color = color; }
    get backgroundColor(): string { return this._color; }
    
    constructor(loop: Loop, width: number, height: number,
        left: number = 0, top: number = 0, backgroundColor: string = "gray") {
        this._canvas = document.createElement("canvas");
        this._context = this._canvas.getContext("2d");
        this._color = backgroundColor;

        this._canvas.width = width;
        this._canvas.height = height;
        this._canvas.style.left = left.toString();
        this._canvas.style.top = top.toString();
        document.body.insertBefore(this._canvas, document.body.childNodes[0]);
        loop.onUpdate.add(this.render, this);
    }
    addRenderComponent(component: IRenderable, toLayer: number): void {
        let layer = this._layers.find((value) => value.layer == toLayer);
        if (layer == undefined) {
            layer = {
                layer: toLayer,
                renderables: []
            };
            this._layers.push(layer);
            this._layers.sort((layerA, layerB) => layerB.layer - layerA.layer);
        }
        if (layer.renderables.indexOf(component) != -1) return;
        component.onDestroy.add(() => this.removeRenderComponent(component, toLayer), this);
        layer.renderables.push(component);
    }
    removeRenderComponent(component: IRenderable, fromLayer: number): void {
        let layer = this._layers.find((value) => value.layer == fromLayer);
        if (layer == undefined) return;
        let index = layer.renderables.indexOf(component);
        if (index == -1) return;
        layer.renderables.splice(index, 1);
    }
    

    wipe() {
        this._context.clearRect(this.left, this.top, this.width, this.height);
    }

    render() {
    this.paintBackground();
    this._layers.forEach((layer) => {
        layer.renderables.forEach((renderable) => {
            renderable.Render(this._context);
        });
    });
}

    paintBackground() {
        this.wipe();
        this._context.fillStyle = this._color;
        this._context.fillRect(0, 0, this.width, this.height);
    }
}