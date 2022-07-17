class RayRenderOffset {
    constructor(layer, x0, y0, lean, length = 1, color = 'black', duration = 100) {
        this._onDestroy = new Action();
        let line = rayToLine(x0, y0, lean, length);
        this._x1 = line.x1;
        this._y1 = line.y1;
        this._x2 = line.x2;
        this._y2 = line.y2;
        this._color = color;
        layer.addRenderable(this);
        this._onDestroy.add(() => layer.removeRenderable(this), this);
        setTimeout(() => this.destroy.call(this), duration);
    }
    get onDestroy() { return this._onDestroy; }
    destroy() { this._onDestroy.invoke(); }
    render(context, offsetX, offsetY) {
        context.strokeStyle = this._color;
        context.beginPath();
        context.moveTo(this._x1 - offsetX, this._y1 - offsetY);
        context.lineTo(this._x2 - offsetX, this._y2 - offsetY);
        context.stroke();
    }
}
