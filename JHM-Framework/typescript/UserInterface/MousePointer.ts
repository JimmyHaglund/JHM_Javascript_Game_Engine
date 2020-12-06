class MousePointer implements IPhysicsActor {
    private _mouseX: number = 0;
    private _mouseY: number = 0;
    private _mouseWasPressed: boolean = false;
    private _mouseWasReleased: boolean = false;
    private _buttonMap = new Map();
    private _onDestroy: Action = new Action();

    get onDestroy() { return this._onDestroy; }
    get OnCollisionEnter(): Action { return null; }
    get OnCollisionExit(): Action { return null; }
    get OnCollisionStay(): Action { return null; }

    constructor(mouseInput: MouseInput, loop: ILoop, physicsSpace: PhysicsSpace) {
        let mouseDownId = mouseInput.onMouseDown.add(() => {
            this._mouseWasPressed = true;
            loop.update();
            this._mouseWasPressed = false;
        }, this);
        let mouseUpId = mouseInput.onMouseUp.add(() => {
            this._mouseWasReleased = true;
            loop.update();
            this._mouseWasReleased = false;
        }, this);
        let mouseMoveId = mouseInput.onMouseMove.add((event: MouseEvent) => {
            this._mouseX = event.clientX;
            this._mouseY = event.clientY;
            loop.update();
        }, this);
        this._onDestroy.add(() => mouseInput.onMouseDown.remove(mouseDownId), this);
        this._onDestroy.add(() => mouseInput.onMouseUp.remove(mouseUpId), this);
        this._onDestroy.add(() => mouseInput.onMouseMove.remove(mouseMoveId), this);
    }
    Destroy() {
        this._onDestroy.invoke();
    }
    addButton(button: BoxButton) {
        this._buttonMap.set(button.collider, button);
    }
    public CheckCollision(colliders: ICollider[]): void {
        colliders.forEach(collider => {
            let button = this._buttonMap.get(collider) as BoxButton;
            if (button != undefined) {
                if (this._mouseWasReleased) {
                    button.release(this._mouseX, this._mouseY);
                }
                if (collider.overlapsPoint(this._mouseX, this._mouseY)) {
                    if (this._mouseWasPressed) {
                        button.press();
                    } else {
                        button.hover();
                    }
                } else {
                    button.stopHover();
                }
            }
        });
    }

    private 
}