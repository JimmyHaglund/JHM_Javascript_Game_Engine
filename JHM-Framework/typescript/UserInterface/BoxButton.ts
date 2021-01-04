class BoxButton implements IDestroyable {
    private static _buttonStates = {
        passive: 0,
        hovered: 1,
        pressed: 2
    }
    private _spritesIds: {
        normal: string,
        hover: string,
        press: string
    };
    private _entity: Entity;
    private _sprite: Sprite;
    private _collider: BoxCollider;
    private _state: number = BoxButton._buttonStates.passive;
    private _onClick: Action = new Action();

    readonly onDestroy: Action = new Action();

    get collider(): BoxCollider { return this._collider; }
    get onClick(): Action { return this._onClick; }

    constructor(renderSpace: RenderLayer, physicsSpace: PhysicsSpace, left: number, top: number, width: number, height: number,
        normalSprite: string = "", hoverSprite: string = "", pressSprite: string = "") {
        this._spritesIds = {
            normal: normalSprite,
            hover: hoverSprite,
            press: pressSprite
        };
        this._entity = new Entity(left, top);
        this._sprite = new Sprite(this._entity, normalSprite);
        this._collider = new BoxCollider(this._entity, width, height);
        physicsSpace.addCollider(this._collider);

        this._sprite.width = width;
        this._sprite.height = height;
        // this._sprAddRenderComponenth * 0.5;
        // this._sprite.offsetY = height * 0.5;
        renderSpace.addRenderable(this._sprite);

        this._entity.addComponent(this._sprite);
        this._entity.addComponent(this._collider);
    }

    public destroy(): void {
        this._entity.destroy();
    }

    public press(): void {
        if (this._state == BoxButton._buttonStates.pressed) return;
        this._state = BoxButton._buttonStates.pressed;
        this.updateSprite();
    }
    release(mouseX: number = -2000, mouseY: number = -2000): void {
        if (this._state != BoxButton._buttonStates.pressed) return;
        if (this._collider.overlapsPoint(mouseX, mouseY)) {
            this._onClick.invoke();
            this._state = BoxButton._buttonStates.hovered;
            this.updateSprite();
            return;
        }
        this._state = BoxButton._buttonStates.passive;
        this.updateSprite();
    }
    hover(): void {
        if (this._state == BoxButton._buttonStates.pressed ||
            this._state == BoxButton._buttonStates.hovered) return;
        this._state = BoxButton._buttonStates.hovered;
        this.updateSprite();
    }
    stopHover(): void {
        if (this._state == BoxButton._buttonStates.passive ||
            this._state == BoxButton._buttonStates.pressed) return;
        this._state = BoxButton._buttonStates.passive;
        this.updateSprite();
    }
    updateSprite(): void {
        switch (this._state) {
            case BoxButton._buttonStates.pressed:
                this._sprite.spriteId = this._spritesIds.press;
                break;
            case BoxButton._buttonStates.hovered:
                this._sprite.spriteId = this._spritesIds.hover;
                break;
            default:
                this._sprite.spriteId = this._spritesIds.normal;
                break;
        }
    }
}