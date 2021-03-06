class CircleRenderer implements IRenderable, IDestroyable {
    private _onDestroy: Action = new Action();
    private _radius: number;
    private _color: string;
    private _transform: Transform;
    private _startAngle: number;
    private _endAngle: number;
    private _clockWise: boolean;

    get onDestroy(): Action { return this._onDestroy; }

    constructor(radius: number, transform: Transform, color: string = 'black', startAngle = 0, endAngle = 2 * Math.PI, clockwise = false) {
        this._radius = radius;
        this._transform = transform;
        this._startAngle = startAngle;
        this._endAngle = endAngle;
        this._clockWise = clockwise;
        this._color = color;
    }
    render(context: CanvasRenderingContext2D, viewX:number, viewY:number): void {
        context.beginPath();
        context.fillStyle = this._color;
        context.strokeStyle = this._color;
        let centreX = this._transform.worldX - viewX;
        let centreY = this._transform.worldY - viewY;
        context.arc(centreX, centreY, this._radius, this._startAngle, this._endAngle, !this._clockWise);
        context.stroke();
    }
    destroy(): void {
        this._onDestroy.invoke();
    }
}