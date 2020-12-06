class BoxButton {
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

    get collider(): BoxCollider { return this._collider; }
    get onClick(): Action { return this._onClick; }

    constructor(renderSpace: RenderSpace, physicsSpace: PhysicsSpace, left: number, top: number, width: number, height: number,
        normalSprite: string = "", hoverSprite: string = "", pressSprite: string = "") {
        this._spritesIds = {
            normal: normalSprite,
            hover: hoverSprite,
            press: pressSprite
        };
        this._entity = new Entity(left, top);
        this._sprite = new Sprite(this._entity, normalSprite);
        this._collider = new BoxCollider(this._entity, width, height);
        physicsSpace.AddCollider(this._collider);

        this._sprite.width = width;
        this._sprite.height = height;
        // this._sprite.offsetX = width * 0.5;
        // this._sprite.offsetY = height * 0.5;
        renderSpace.addRenderComponent(this._sprite, -100);

        this._entity.addComponent(this._sprite);
        this._entity.addComponent(this._collider);
    }

    press() {
        if (this._state == BoxButton._buttonStates.pressed) return;
        this._state = BoxButton._buttonStates.pressed;
        this.updateSprite();
    }
    release(mouseX = -2000, mouseY = -2000) {
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
    hover() {
        if (this._state == BoxButton._buttonStates.pressed ||
            this._state == BoxButton._buttonStates.hovered) return;
        this._state = BoxButton._buttonStates.hovered;
        this.updateSprite();
    }
    stopHover() {
        if (this._state == BoxButton._buttonStates.passive ||
            this._state == BoxButton._buttonStates.pressed) return;
        this._state = BoxButton._buttonStates.passive;
        this.updateSprite();
    }
    updateSprite() {
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