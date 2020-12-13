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
    }
    updateMousePosition(event) {
        this._mouseX = event.x;
        this._mouseY = event.y;
    }
    startAim(event) {
        this._aimTime = 0;
        this._updateEventIndex = this._loop.onUpdate.add(this.update, this);
        this.update(0);
        this._cone.visible = true;
    }
    getDirection() {
        let startX = this._transform.x;
        let startY = this._transform.y;
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
        let positionX = this._transform.x;
        let positionY = this._transform.y;
        let direction = this.getDirection();
        this._cone.setDirection(direction.x, direction.y);
        this._cone.startPoint.x = positionX;
        this._cone.startPoint.y = positionY;
        this._aimTime += deltaTime;
    }
    logAimTime() {
        console.log("Aimed for", this._aimTime, "seconds");
    }
}
