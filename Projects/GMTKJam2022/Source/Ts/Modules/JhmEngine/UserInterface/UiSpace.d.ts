declare class UiSpace {
    private _loop;
    private _physics;
    private _renderer;
    private _mousePointer;
    private _collisionSpace;
    constructor(renderSpace: RenderLayer, renderLayer: number, mouseInput: MouseInput, keyboarInput?: KeyboardInput);
    createButton(leftPos: number, topPos: number, width: number, height: number, normalSprite?: string, hoverSprite?: string, pressSprite?: string): BoxButton;
}
