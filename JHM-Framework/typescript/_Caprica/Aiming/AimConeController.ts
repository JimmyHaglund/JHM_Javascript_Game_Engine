class AimConeController {
    private _aimTime = 0;
    private _mouseX = 0;
    private _mouseY = 0;
    private _aiming = false;
    private _loop: Loop;
    private _updateEventIndex: number;
    private _cone: AimConeRenderer;
    private _transform: ITransform;
    private _aimData: AimData;
    private _camera: Camera;

    public set aimData(value: AimData) {
        if (value == null) return;
        this._aimData = value;
        this.endAim(null);
    }

    constructor(loop: Loop, characterTransform: ITransform, cone: AimConeRenderer, camera: Camera, aimData:AimData) {
        onMouseDown.add(this.startAim, this);
        onMouseUp.add(this.endAim, this);
        onMouseMoved.add(this.updateMousePosition, this);
        this._loop = loop;
        this._cone = cone;
        this._transform = characterTransform;
        this._aimData = aimData;
        this._camera = camera;
    }

    private updateMousePosition(event: MouseEvent) {
        this._mouseX = event.x;
        this._mouseY = event.y;
    }

    private startAim(event: MouseEvent) {
        if (event.button != 0) return;
        if (this._aiming) return;
        this._aimTime = 0;
        this._updateEventIndex = this._loop.onUpdate.add(this.update, this);
        this.updateAimDirection();
        this.updateAimAngle();
        this._cone.visible = true;
        this._aiming = true;
    }

    private endAim(event: MouseEvent) {
        if (!this._aiming) return;
        this._loop.onUpdate.remove(this._updateEventIndex);
        this._cone.visible = false;
        this._aiming = false;
    }

    private getDirection(): { x: number, y: number } {
        let mouseWorldPosition = this._camera.getMouseWorldPosition();
        let positionX = this._transform.worldX;
        let positionY = this._transform.worldY;
        return {
            x: mouseWorldPosition.x - positionX,
            y: mouseWorldPosition.y - positionY
        };
    }

    

    private update(deltaTime: number) {
        this._aimTime += deltaTime;
        this.updateAimDirection();
        this.updateAimAngle();
    }

    private updateAimDirection() {
        let positionX = this._transform.worldX;
        let positionY = this._transform.worldY;
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