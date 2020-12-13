class AimConeRenderer implements IRenderable {
    public startPoint: { x: number, y: number };
    public coneAngle = Math.PI * 0.25;
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
        context.strokeStyle = "#000000"; // Black
        this.renderLookDirectionLine(context);
        context.strokeStyle = "#45f71b"; // Lime
        this.renderCone(context);
    }

    setDirection(x: number, y: number) {
        this._direction = algebra.normalize(x, y);
    }

    private getConeMiddleTip() {
        let startX = this.startPoint.x;
        let startY = this.startPoint.y;
        return {
            x: startX + this._direction.x * this._coneDistance,
            y: startY + this._direction.y * this._coneDistance
        };
    }

    private renderLookDirectionLine(context: CanvasRenderingContext2D) {
        let destination = this.getConeMiddleTip();
        context.beginPath();
        context.moveTo(this.startPoint.x, this.startPoint.y);
        context.lineTo(destination.x, destination.y);
        context.stroke();
    }

    private renderCone(context: CanvasRenderingContext2D) {
        let coneDirectionX = this._direction.x * this._coneDistance;
        let coneDirectionY = this._direction.y * this._coneDistance;
        let coneRight = algebra.rotate(coneDirectionX, coneDirectionY, -this.coneAngle * 0.5);
        let coneLeft = algebra.rotate(coneDirectionX, coneDirectionY, this.coneAngle * 0.5);
        let coneTipRight = vector.add(this.startPoint, coneRight);
        let coneTipLeft = vector.add(this.startPoint, coneLeft);
        this.renderLine(this.startPoint.x, this.startPoint.y, coneTipLeft.x, coneTipLeft.y, context);
        this.renderLine(this.startPoint.x, this.startPoint.y, coneTipRight.x, coneTipRight.y, context);
    }

    private renderLine(x0:number, y0:number, x1:number, y1:number, context:CanvasRenderingContext2D) {
        context.beginPath();
        context.moveTo(x0, y0);
        context.lineTo(x1, y1);
        context.stroke();
    }
}