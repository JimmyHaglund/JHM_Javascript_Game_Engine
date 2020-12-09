class AimConeRenderer {
    constructor(renderSpace, coneDistance = 100) {
        this.visible = false;
        this._onDestroy = new Action();
        renderSpace.addRenderComponent(this, -5);
        this._coneDistance = coneDistance;
        this.setDirection(1, 0);
        this.startPoint = { x: 0, y: 0 };
    }
    get onDestroy() { return this._onDestroy; }
    destroy() {
        this._onDestroy.invoke();
    }
    render(context) {
        if (!this.visible)
            return;
        context.strokeStyle = "#000000";
        this.renderLookDirectionLine(context);
        console.log("Rendering aim cone");
    }
    setDirection(x, y) {
        this._direction = algebra.normalize(x, y);
    }
    getConeDestination() {
        let startX = this.startPoint.x;
        let startY = this.startPoint.y;
        return {
            x: startX + this._direction.x * this._coneDistance,
            y: startY + this._direction.y * this._coneDistance
        };
    }
    renderLookDirectionLine(context) {
        let destination = this.getConeDestination();
        context.beginPath();
        context.moveTo(this.startPoint.x, this.startPoint.y);
        context.lineTo(destination.x, destination.y);
        context.stroke();
    }
}
