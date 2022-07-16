declare class BoxButton implements IDestroyable {
    private static _buttonStates;
    private _spritesIds;
    private _entity;
    private _sprite;
    private _collider;
    private _state;
    private _onClick;
    readonly onDestroy: Action;
    get collider(): BoxCollider;
    get onClick(): Action;
    constructor(renderSpace: RenderLayer, collisionSpace: CollisionSpace, left: number, top: number, width: number, height: number, normalSprite?: string, hoverSprite?: string, pressSprite?: string);
    destroy(): void;
    press(): void;
    release(mouseX?: number, mouseY?: number): void;
    hover(): void;
    stopHover(): void;
    updateSprite(): void;
}
