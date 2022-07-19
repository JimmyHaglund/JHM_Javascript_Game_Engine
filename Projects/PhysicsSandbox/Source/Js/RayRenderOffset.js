class RayRenderOffset {
    constructor(layer, x0, y0, x1, y1, color = 'black', duration = 100) {
        this._onDestroy = new Action();
        this._x1 = x0;
        this._y1 = y0;
        this._x2 = x1;
        this._y2 = y1;
        this._color = color;
        layer.addRenderable(this);
        this._onDestroy.add(() => layer.removeRenderable(this), this);
        if (duration <= 0)
            return;
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
