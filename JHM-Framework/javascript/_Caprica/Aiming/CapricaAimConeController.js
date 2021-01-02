class AimConeController {
    constructor(loop, characterTransform, cone) {
        this._aimTime = 0;
        this._mouseX = 0;
        this._mouseY = 0;
        onMouseDown.add(this.startAim, this);
        onMouseUp.add(this.endAim, this);
        onMouseMoved.add(this.updateMousePosition, this);
        this._loop = loop;
        this._cone = cone;
        this._transform = characterTransform;
        this._aimData = new AimData(Math.PI * 0.5, Math.PI * 0.15, 0.5);
    }
    set aimData(value) {
        if (value == null)
            return;
        this._aimData = value;
        this.endAim(null);
    }
    updateMousePosition(event) {
        this._mouseX = event.x;
        this._mouseY = event.y;
    }
    startAim(event) {
        this._aimTime = 0;
        this._updateEventIndex = this._loop.onUpdate.add(this.update, this);
        this.updateAimDirection();
        this.updateAimAngle();
        this._cone.visible = true;
    }
    getDirection() {
        // TODO: This is horse shit. Properly refactor aim cone controller and aim cone renderer
        // to work with moveable views. Should probably just pass in a camera to this object.
        let startX = gameData.render.width * 0.5; //this._transform.x;
        let startY = gameData.render.height * 0.5; // viewCentre.y;// this._transform.y;
        let goalX = this._mouseX;
        let goalY = this._mouseY;
        return {
            x: goalX - startX,
            y: goalY - startY
        };
    }
    endAim(event) {
        this._loop.onUpdate.remove(this._updateEventIndex);
        this._cone.visible = false;
    }
    update(deltaTime) {
        this._aimTime += deltaTime;
        this.updateAimDirection();
        this.updateAimAngle();
    }
    updateAimDirection() {
        let positionX = this._transform.x;
        let positionY = this._transform.y;
        let direction = this.getDirection();
        this._cone.setDirection(direction.x, direction.y);
        this._cone.setStartPoint(positionX, positionY);
    }
    updateAimAngle() {
        let aimPercent = this._aimTime / this._aimData.aimSeconds;
        if (aimPercent > 1.0) {
            this._cone.coneAngle = this._aimData.aimEndAngle;
            return;
        }
        let baseAngle = this._aimData.aimStartAngle;
        let deltaAngle = baseAngle - this._aimData.aimEndAngle;
        this._cone.coneAngle = baseAngle - deltaAngle * aimPercent;
    }
}
