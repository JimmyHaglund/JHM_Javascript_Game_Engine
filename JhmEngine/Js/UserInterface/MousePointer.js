class MousePointer {
    constructor(mouseInput, loop, physicsSpace) {
        this._mouseX = 0;
        this._mouseY = 0;
        this._mouseWasPressed = false;
        this._mouseWasReleased = false;
        this._buttonMap = new Map();
        this._onDestroy = new Action();
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
        let mouseMoveId = mouseInput.onMouseMove.add((event) => {
            this._mouseX = event.clientX;
            this._mouseY = event.clientY;
            loop.update();
        }, this);
        this._onDestroy.add(() => mouseInput.onMouseDown.remove(mouseDownId), this);
        this._onDestroy.add(() => mouseInput.onMouseUp.remove(mouseUpId), this);
        this._onDestroy.add(() => mouseInput.onMouseMove.remove(mouseMoveId), this);
    }
    get onDestroy() { return this._onDestroy; }
    get onCollisionEnter() { return null; }
    get onCollisionExit() { return null; }
    get onCollisionStay() { return null; }
    destroy() {
        this._onDestroy.invoke();
    }
    addButton(button) {
        this._buttonMap.set(button.collider, button);
    }
    checkCollision(colliders) {
        colliders.forEach(collider => {
            let button = this._buttonMap.get(collider);
            if (button != undefined) {
                if (this._mouseWasReleased) {
                    button.release(this._mouseX, this._mouseY);
                }
                if (collider.overlapsPoint(this._mouseX, this._mouseY)) {
                    if (this._mouseWasPressed) {
                        button.press();
                    }
                    else {
                        button.hover();
                    }
                }
                else {
                    button.stopHover();
                }
            }
        });
    }
}
