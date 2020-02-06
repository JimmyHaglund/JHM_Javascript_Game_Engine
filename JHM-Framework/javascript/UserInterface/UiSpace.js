class UiSpace {
    constructor(renderSpace, renderLayer = -1000, mouseInput, keyboarInput = null) {
        this._renderer = renderSpace;
        this._loop = new UiLoop();
        this._physics = new PhysicsSpace(this._loop);
        this._mousePointer = new MousePointer(mouseInput, this._loop, this._physics);
    }
    createButton(leftPos, topPos, width, height, normalSprite = "", hoverSprite = "", pressSprite = "") {
        let button = new BoxButton(this._renderer, this._physics, leftPos, topPos, width, height, normalSprite, hoverSprite, pressSprite);
        this._mousePointer.addButton(button);
        return button;
    }
}
class MousePointer {
    constructor(mouseInput, loop, physicsSpace) {
        this._mouseX = 0;
        this._mouseY = 0;
        this._mouseWasPressed = false;
        this._mouseWasReleased = false;
        this._buttonMap = new Map();
        mouseInput.onMouseDown.add(() => {
            this._mouseWasPressed = true;
            loop.update();
            this._mouseWasPressed = false;
        }, this);
        mouseInput.onMouseUp.add(() => {
            this._mouseWasReleased = true;
            loop.update();
            this._mouseWasReleased = false;
        }, this);
        mouseInput.onMouseMove.add((event) => {
            this._mouseX = event.clientX;
            this._mouseY = event.clientY;
            loop.update();
        }, this);
        physicsSpace.addPhysicsActor(this);
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
