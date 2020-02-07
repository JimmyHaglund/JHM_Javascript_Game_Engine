class UiSpace {
    private _loop: ILoop;
    private _physics: PhysicsSpace;
    private _renderer: RenderSpace;
    private _mousePointer: MousePointer;
    constructor(renderSpace: RenderSpace, renderLayer: number = -1000,
        mouseInput: MouseInput, keyboarInput: KeyboardInput = null) {
        this._renderer = renderSpace;
        this._loop = new UiLoop();
        this._physics = new PhysicsSpace(this._loop);
        this._mousePointer = new MousePointer(mouseInput, this._loop, this._physics);
    }
    createButton(leftPos: number, topPos: number,
        width: number, height: number,
        normalSprite: string = "", hoverSprite: string = "",
        pressSprite: string = ""): BoxButton {
        let button = new BoxButton(this._renderer, this._physics,
            leftPos, topPos, width, height,
            normalSprite, hoverSprite, pressSprite);
        this._mousePointer.addButton(button);
        return button;
    }
}
class MousePointer implements IPhysicsActor {
    private _mouseX: number = 0;
    private _mouseY: number = 0;
    private _mouseWasPressed: boolean = false;
    private _mouseWasReleased: boolean = false;
    private _buttonMap = new Map();
    private _onDestroy: Action = new Action();

    get onDestroy() { return this._onDestroy; }

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
        physicsSpace.addPhysicsActor(this);
        this._onDestroy.add(() => mouseInput.onMouseDown.remove(mouseDownId), this);
        this._onDestroy.add(() => mouseInput.onMouseUp.remove(mouseUpId), this);
        this._onDestroy.add(() => mouseInput.onMouseMove.remove(mouseMoveId), this);
        this._onDestroy.add(() => physicsSpace.removePhysicsActor(this), this);
    }
    destroy() {
        this._onDestroy.invoke();
    }
    addButton(button: BoxButton) {
        this._buttonMap.set(button.collider, button);
    }
    checkCollision(colliders: ICollider[]): void {
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
}