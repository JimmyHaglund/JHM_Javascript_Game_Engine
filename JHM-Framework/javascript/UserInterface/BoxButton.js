class BoxButton {
    constructor(renderSpace, physicsSpace, left, top, width, height, normalSprite = "", hoverSprite = "", pressSprite = "") {
        this._state = BoxButton._buttonStates.passive;
        this._onClick = new Action();
        this.onDestroy = new Action();
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
    get collider() { return this._collider; }
    get onClick() { return this._onClick; }
    destroy() {
        this._entity.destroy();
    }
    press() {
        if (this._state == BoxButton._buttonStates.pressed)
            return;
        this._state = BoxButton._buttonStates.pressed;
        this.updateSprite();
    }
    release(mouseX = -2000, mouseY = -2000) {
        if (this._state != BoxButton._buttonStates.pressed)
            return;
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
            this._state == BoxButton._buttonStates.hovered)
            return;
        this._state = BoxButton._buttonStates.hovered;
        this.updateSprite();
    }
    stopHover() {
        if (this._state == BoxButton._buttonStates.passive ||
            this._state == BoxButton._buttonStates.pressed)
            return;
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
BoxButton._buttonStates = {
    passive: 0,
    hovered: 1,
    pressed: 2
};
