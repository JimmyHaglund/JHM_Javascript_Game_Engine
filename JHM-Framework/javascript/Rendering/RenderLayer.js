class RenderLayer {
    constructor(loop, width, height, left = 0, top = 0, backgroundColor = "gray") {
        this._layers = [];
        this._viewCentreTransform = new Transform(0, 0);
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
    get canvas() { return this._canvas; }
    set canvasBoundsRect(value) {
        this.setCanvasBoundsRect(value.left, value.right, value.top, value.bottom);
    }
    get canvasBoundRect() {
        return {
            right: parseInt(this._canvas.style.right, 10),
            left: parseInt(this._canvas.style.left, 10),
            top: parseInt(this._canvas.style.top, 10),
            bottom: parseInt(this._canvas.style.bottom, 10)
        };
    }
    set backgroundColor(color) { this._color = color; }
    get backgroundColor() { return this._color; }
    get viewCentre() {
        let x = this._viewCentreTransform.x - this.canvas.width * 0.5;
        let y = this._viewCentreTransform.y - this.canvas.height * 0.5;
        return { x: x, y: y };
    }
    get viewTransform() { return this._viewCentreTransform; }
    set viewTransform(value) { this._viewCentreTransform = value; }
    destroy() {
        this._canvas.remove();
    }
    addRenderComponent(component, distanceFromCamera) {
        let layer = this._layers.find((value) => value.distanceFromCamera == distanceFromCamera);
        if (layer == undefined) {
            layer = {
                distanceFromCamera: distanceFromCamera,
                renderables: []
            };
            this._layers.push(layer);
            this._layers.sort((layerA, layerB) => layerB.distanceFromCamera - layerA.distanceFromCamera);
        }
        if (layer.renderables.indexOf(component) != -1)
            return;
        component.onDestroy.add(() => this.removeRenderComponent(component, distanceFromCamera), this);
        layer.renderables.push(component);
    }
    removeRenderComponent(component, fromLayer) {
        let layer = this._layers.find((value) => value.distanceFromCamera == fromLayer);
        if (layer == undefined)
            return;
        let index = layer.renderables.indexOf(component);
        if (index == -1)
            return;
        layer.renderables.splice(index, 1);
    }
    wipe() {
        var canvasBounds = this.canvasBoundsRect;
        this._context.clearRect(canvasBounds.left, canvasBounds.top, this.canvas.width, this.canvas.height);
    }
    render() {
        this.paintBackground();
        this._layers.forEach((layer) => {
            this.renderLayer(layer);
        });
    }
    paintBackground() {
        this.wipe();
        this._context.fillStyle = this._color;
        this._context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    setCanvasBoundsRect(left, right, top, bottom) {
        this._canvas.style.left = left + 'px';
        this._canvas.style.right = right + 'px';
        this._canvas.style.top = top + 'px';
        this._canvas.style.bottom = bottom + 'px';
    }
    renderLayer(layer) {
        let centre = this.viewCentre;
        layer.renderables.forEach((renderable) => {
            renderable.render(this._context, centre.x, centre.y);
        });
    }
}
