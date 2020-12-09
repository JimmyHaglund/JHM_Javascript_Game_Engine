class UiSpace {
    private _loop: ILoop;
    private _physics: PhysicsSpace;
    private _renderer: RenderSpace;
    private _mousePointer: MousePointer;
    private _physicsSpace: PhysicsSpace;
    constructor(renderSpace: RenderSpace, renderLayer: number = -1000,
        mouseInput: MouseInput, keyboarInput: KeyboardInput = null) {
        this._renderer = renderSpace;
        this._loop = new UiLoop(mouseInput);
        this._physics = new PhysicsSpace(this._loop);
        this._mousePointer = new MousePointer(mouseInput, this._loop, this._physics);
    }
    public createButton(leftPos: number, topPos: number,
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