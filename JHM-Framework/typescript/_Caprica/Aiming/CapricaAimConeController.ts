class AimConeController {
    private _loop: Loop;
    private _aimTime = 0;
    private _updateEventIndex: number;
    private _cone: AimConeRenderer;
    private _transform: ITransform;
    private _mouseX = 0;
    private _mouseY = 0;
    private _aimData: AimData;

    public set aimData(value:AimData) {
        if (value == null) return;
        this._aimData = value;
        this.endAim(null);
    }

    constructor(loop: Loop, characterTransform: ITransform, cone: AimConeRenderer, viewCentre:ITransform = null) {
        onMouseDown.add(this.startAim, this);
        onMouseUp.add(this.endAim, this);
        onMouseMoved.add(this.updateMousePosition, this);
        this._loop = loop;
        this._cone = cone;
        this._transform = characterTransform;
        this._aimData = new AimData(Math.PI * 0.5, Math.PI * 0.15, 0.5);
    }

    private updateMousePosition(event:MouseEvent) {
        this._mouseX = event.x;
        this._mouseY = event.y;
    }

    private startAim(event: MouseEvent) {
        this._aimTime = 0;
        this._updateEventIndex = this._loop.onUpdate.add(this.update, this);
        this.updateAimDirection();
        this.updateAimAngle();
        this._cone.visible = true;
    }

    private getDirection(): { x: number, y: number } {
        // TODO: This is horse shit. Properly refactor aim cone controller and aim cone renderer
        // to work with moveable views. Should probably just pass in a camera to this object.
        let startX = gameData.render.canvas.width * 0.5;//this._transform.x;
        let startY = gameData.render.canvas.height * 0.5;// viewCentre.y;// this._transform.y;
        let goalX = this._mouseX;
        let goalY = this._mouseY;
        return {
            x: goalX - startX,
            y: goalY - startY
        };
    }

    private endAim(event: MouseEvent) {
        this._loop.onUpdate.remove(this._updateEventIndex);
        this._cone.visible = false;
    }

    private update(deltaTime: number) {
        this._aimTime += deltaTime;
        this.updateAimDirection();
        this.updateAimAngle();
    }

    private updateAimDirection() {
        let positionX = this._transform.x;
        let positionY = this._transform.y;
        let direction = this.getDirection();

        this._cone.setDirection(direction.x, direction.y);
        this._cone.setStartPoint(positionX, positionY);
    }

    private updateAimAngle() {
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