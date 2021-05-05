class CircleRenderer {
    constructor(radius, transform, color = 'black', startAngle = 0, endAngle = 2 * Math.PI, clockwise = false) {
        this._onDestroy = new Action();
        this._radius = radius;
        this._transform = transform;
        this._startAngle = startAngle;
        this._endAngle = endAngle;
        this._clockWise = clockwise;
        this._color = color;
    }
    get onDestroy() { return this._onDestroy; }
    render(context, viewX, viewY) {
        context.beginPath();
        context.fillStyle = this._color;
        context.strokeStyle = this._color;
        let centreX = this._transform.worldX - viewX;
        let centreY = this._transform.worldY - viewY;
        context.arc(centreX, centreY, this._radius, this._startAngle, this._endAngle, !this._clockWise);
        context.stroke();
    }
    destroy() {
        this._onDestroy.invoke();
    }
}
