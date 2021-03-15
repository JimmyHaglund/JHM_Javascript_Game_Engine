class AimConeRenderer {
    constructor(renderSpace, coneDistance = 100) {
        this._startPoint = { x: 0, y: 0 };
        this._viewPosition = { x: 0, y: 0 };
        this.coneAngle = Math.PI * 0.25;
        this.visible = false;
        this._onDestroy = new Action();
        renderSpace.addRenderable(this);
        this._coneDistance = coneDistance;
        this.setDirection(1, 0);
    }
    get onDestroy() { return this._onDestroy; }
    get startPoint() {
        return {
            x: this._startPoint.x - this._viewPosition.x,
            y: this._startPoint.y - this._viewPosition.y
        };
    }
    destroy() {
        this._onDestroy.invoke();
    }
    render(context, viewX, viewY) {
        if (!this.visible)
            return;
        this._viewPosition = { x: viewX, y: viewY };
        context.strokeStyle = "#000000"; // Black
        this.renderLookDirectionLine(context);
        context.strokeStyle = "#45f71b"; // Lime
        this.renderCone(context);
        context.strokeStyle = "red";
        this.renderDiff(context);
    }
    setDirection(x, y) {
        this._direction = algebra.normalize(x, y);
    }
    setStartPoint(x, y) {
        this._startPoint.x = x;
        this._startPoint.y = y;
    }
    getConeMiddleTip() {
        let startX = this.startPoint.x;
        let startY = this.startPoint.y;
        return {
            x: startX + this._direction.x * this._coneDistance,
            y: startY + this._direction.y * this._coneDistance
        };
    }
    renderLookDirectionLine(context) {
        let destination = this.getConeMiddleTip();
        context.beginPath();
        context.moveTo(this.startPoint.x, this.startPoint.y);
        context.lineTo(destination.x, destination.y);
        context.stroke();
    }
    renderCone(context) {
        let coneDirectionX = this._direction.x * this._coneDistance;
        let coneDirectionY = this._direction.y * this._coneDistance;
        let coneRight = algebra.rotate(coneDirectionX, coneDirectionY, -this.coneAngle * 0.5);
        let coneLeft = algebra.rotate(coneDirectionX, coneDirectionY, this.coneAngle * 0.5);
        let coneTipRight = vector.add(this.startPoint, coneRight);
        let coneTipLeft = vector.add(this.startPoint, coneLeft);
        this.renderLine(this.startPoint.x, this.startPoint.y, coneTipLeft.x, coneTipLeft.y, context);
        this.renderLine(this.startPoint.x, this.startPoint.y, coneTipRight.x, coneTipRight.y, context);
    }
    renderDiff(context) {
        let a = { x: 0, y: 0 };
        let b = { x: this._startPoint.x, y: this._startPoint.y };
        let c = { x: b.x - this._viewPosition.x, y: b.y - this._viewPosition.y };
        let d = { x: this._viewPosition.x, y: this._viewPosition.y };
        this.renderLine(a.x, a.y, b.x, b.y, context);
        context.strokeStyle = "blue";
        this.renderLine(a.x, a.y, d.x, d.y, context);
    }
    renderLine(x0, y0, x1, y1, context) {
        context.beginPath();
        context.moveTo(x0, y0);
        context.lineTo(x1, y1);
        context.stroke();
    }
}
