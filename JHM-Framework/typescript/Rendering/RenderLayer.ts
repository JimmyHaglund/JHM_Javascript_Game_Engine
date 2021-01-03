interface ILayer {
    distanceFromCamera: number,
    renderables: IRenderable[]
}

class RenderLayer implements IDestroyable {
    onDestroy: Action;
    private _layers: ILayer[] = [];
    private _canvas: HTMLCanvasElement;
    private _context: CanvasRenderingContext2D;
    private _color: string;
    private _viewCentreTransform: ITransform = new Transform(0, 0);

    public get canvas(): HTMLCanvasElement { return this._canvas; }
    public set canvasBoundsRect(value:{ left:number, right:number, top:number, bottom:number }) {
        this.setCanvasBoundsRect(value.left, value.right, value.top, value.bottom);
    }
    public get canvasBoundRect(): { left: number, right: number, top: number, bottom: number } {
        return {
            right: parseInt(this._canvas.style.right, 10),
            left: parseInt(this._canvas.style.left, 10),
            top: parseInt(this._canvas.style.top, 10),
            bottom: parseInt(this._canvas.style.bottom, 10)
        };
    }

    public set backgroundColor(color: string) { this._color = color; }
    public get backgroundColor(): string { return this._color; }
    public get viewCentre(): { x: number, y: number } {
        let x = this._viewCentreTransform.x - this.canvas.width * 0.5;
        let y = this._viewCentreTransform.y - this.canvas.height * 0.5;
        return { x: x, y: y };
    }
    public get viewTransform(): ITransform { return this._viewCentreTransform; }
    public set viewTransform(value: ITransform) { this._viewCentreTransform = value; }

    constructor(loop: ILoop, width: number, height: number,
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

    public destroy(): void {
        this._canvas.remove();
    }

    public addRenderComponent(component: IRenderable, distanceFromCamera: number): void {
        let layer = this._layers.find((value) => value.distanceFromCamera == distanceFromCamera);
        if (layer == undefined) {
            layer = {
                distanceFromCamera: distanceFromCamera,
                renderables: []
            };
            this._layers.push(layer);
            this._layers.sort((layerA, layerB) => layerB.distanceFromCamera - layerA.distanceFromCamera);
        }
        if (layer.renderables.indexOf(component) != -1) return;
        component.onDestroy.add(() => this.removeRenderComponent(component, distanceFromCamera), this);
        layer.renderables.push(component);
    }

    public removeRenderComponent(component: IRenderable, fromLayer: number): void {
        let layer = this._layers.find((value) => value.distanceFromCamera == fromLayer);
        if (layer == undefined) return;
        let index = layer.renderables.indexOf(component);
        if (index == -1) return;
        layer.renderables.splice(index, 1);
    }

    public wipe():void {
        var canvasBounds = this.canvasBoundsRect;
        this._context.clearRect(canvasBounds.left, canvasBounds.top, this.canvas.width, this.canvas.height);
    }

    public render():void {
        this.paintBackground();
        this._layers.forEach((layer) => {
            this.renderLayer(layer);
        });
    }

    public paintBackground():void {
        this.wipe();
        this._context.fillStyle = this._color;
        this._context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    public setCanvasBoundsRect(left: number, right: number, top: number, bottom: number):void {
        this._canvas.style.left = left + 'px';
        this._canvas.style.right = right + 'px';
        this._canvas.style.top = top + 'px';
        this._canvas.style.bottom = bottom + 'px';
    }

    public renderLayer(layer):void {
        let centre = this.viewCentre;
        layer.renderables.forEach((renderable) => {
            renderable.render(this._context, centre.x, centre.y);
        });
    }
}