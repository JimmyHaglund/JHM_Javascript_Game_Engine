class AimConeRenderer implements IRenderable {
    public startPoint: { x: number, y: number };
    public coneAngle: number;
    public visible = false;
    private _onDestroy = new Action();
    private _coneDistance: number;
    private _direction: { x: number, y: number };

    public get onDestroy() { return this._onDestroy; }

    constructor(renderSpace: RenderSpace, coneDistance: number = 100) {
        renderSpace.addRenderComponent(this, -5);
        this._coneDistance = coneDistance;
        this.setDirection(1, 0);
        this.startPoint = { x: 0, y: 0 };
    }


    destroy() {
        this._onDestroy.invoke();
    }

    render(context: CanvasRenderingContext2D) {
        if (!this.visible) return;
        context.strokeStyle = "#000000";
        this.renderLookDirectionLine(context);
        console.log("Rendering aim cone");
    }

    setDirection(x: number, y: number) {
        this._direction = algebra.normalize(x, y);
    }

    private getConeDestination() {
        let startX = this.startPoint.x;
        let startY = this.startPoint.y;
        return {
            x: startX + this._direction.x * this._coneDistance,
            y: startY + this._direction.y * this._coneDistance
        };
    }

    private renderLookDirectionLine(context: CanvasRenderingContext2D) {
        let destination = this.getConeDestination();
        context.beginPath();
        context.moveTo(this.startPoint.x, this.startPoint.y);
        context.lineTo(destination.x, destination.y);
        context.stroke();
    }
}