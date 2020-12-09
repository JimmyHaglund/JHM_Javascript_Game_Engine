class AimConeController {
    private _loop: Loop;
    private _aimTime = 0;
    private _updateEventIndex: number;
    private _cone: AimConeRenderer;
    private _transform: ITransform;
    private _mouseX = 0;
    private _mouseY = 0;

    constructor(loop: Loop, characterTransform: ITransform, cone: AimConeRenderer) {
        onMouseDown.add(this.startAim, this);
        onMouseUp.add(this.endAim, this);
        onMouseMoved.add(this.updateMousePosition, this);
        this._loop = loop;
        this._cone = cone;
        this._transform = characterTransform;
    }

    private updateMousePosition(event:MouseEvent) {
        this._mouseX = event.x;
        this._mouseY = event.y;
    }

    private startAim(event: MouseEvent) {
        this._aimTime = 0;
        this._updateEventIndex = this._loop.onUpdate.add(this.update, this);
        
        this._cone.visible = true;
    }

    private getDirection(): { x: number, y: number } {
        let startX = this._transform.x;
        let startY = this._transform.y;
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
        let positionX = this._transform.x;
        let positionY = this._transform.y;
        let direction = this.getDirection();

        this._cone.setDirection(direction.x, direction.y);
        this._cone.startPoint.x = positionX;
        this._cone.startPoint.y = positionY;
        this._aimTime += deltaTime;
    }

    private logAimTime(): void {
        console.log("Aimed for", this._aimTime, "seconds");
    }
}