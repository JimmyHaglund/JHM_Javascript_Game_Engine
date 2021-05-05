class UiSpace {
    constructor(renderSpace, renderLayer = -1000, mouseInput, keyboarInput = null) {
        this._renderer = renderSpace;
        this._loop = new UiLoop(mouseInput);
        this._collisionSpace = new CollisionSpace();
        this._mousePointer = new MousePointer(mouseInput, this._loop, this._physics);
    }
    createButton(leftPos, topPos, width, height, normalSprite = "", hoverSprite = "", pressSprite = "") {
        let button = new BoxButton(this._renderer, this._collisionSpace, leftPos, topPos, width, height, normalSprite, hoverSprite, pressSprite);
        this._mousePointer.addButton(button);
        return button;
    }
}
