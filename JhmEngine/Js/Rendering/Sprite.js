class Sprite {
    constructor(entity, spriteId = "") {
        this._alpha = 1;
        this._offsetX = 0;
        this._offsetY = 0;
        this._onDestroy = new Action();
        this._spriteId = spriteId;
        this._image = document.getElementById(spriteId);
        if (this._image != null) {
            this._width = this._image.naturalWidth;
            this._height = this._image.naturalHeight;
            this._crop = {
                width: this._width,
                height: this._height,
                offsetX: 0,
                offsetY: 0
            };
        }
        else {
            console.log("Warning: Sprite component with sprite id", spriteId, "failed to find an image.");
        }
        this._entity = entity;
        this._entity.addComponent(this);
    }
    set alpha(value) { this._alpha = value; }
    get alpha() { return this._alpha; }
    set spriteId(value) {
        if (this._spriteId == value)
            return;
        this._spriteId = value;
        this._image = document.getElementById(this._spriteId);
    }
    set offsetX(value) { this._offsetX = value; }
    set offsetY(value) { this._offsetY = value; }
    get spriteId() { return this._spriteId; }
    get onDestroy() { return this._onDestroy; }
    get width() { return this._width; }
    set width(value) { this._width = value; }
    get height() { return this._width; }
    set height(value) { this._height = value; }
    get entity() { return this._entity; }
    get rotation() { return this._entity.rotation; }
    destroy() {
        this._onDestroy.invoke();
    }
    render(context, viewX, viewY) {
        let renderStrategy = this.rotation === 0 ? this.renderNonRotated : this.renderRotated;
        renderStrategy(context, viewX, viewY);
    }
    renderNonRotated(context, viewX, viewY) {
        if (this._image == null)
            return;
        let translationX = this.translation.x - viewX;
        let translationY = this.translation.y - viewY;
        let contextSettings = {
            contextAlpha: context.globalAlpha,
            translation: { x: translationX, y: translationY },
            apply: function () {
                context.globalAlpha = this._alpha;
                context.translate(contextSettings.translation.x, contextSettings.translation.y);
            },
            reset: function () {
                context.globalAlpha = contextSettings.contextAlpha;
                context.translate(-contextSettings.translation.x, -contextSettings.translation.y);
            }
        };
        contextSettings.apply();
        this.drawSprite(context);
        contextSettings.reset();
    }
    renderRotated(context, viewX, viewY) {
        let translationX = this.translation.x - viewX;
        let translationY = this.translation.y - viewY;
        let contextSettings = {
            contextAlpha: context.globalAlpha,
            translation: { x: translationX, y: translationY },
            rotation: -this.rotation,
            apply: function () {
                context.globalAlpha = this._alpha;
                context.translate(contextSettings.translation.x, contextSettings.translation.y);
                context.rotate(contextSettings.rotation);
            },
            reset: function () {
                context.globalAlpha = contextSettings.contextAlpha;
                context.rotate(-contextSettings.rotation);
                context.translate(-contextSettings.translation.x, -contextSettings.translation.y);
            }
        };
        contextSettings.apply();
        this.drawSprite(context);
        contextSettings.reset();
    }
    drawSprite(context) {
        context.drawImage(this._image, this._crop.offsetX, this._crop.offsetY, this._crop.width, this._crop.height, this._offsetX, this._offsetY, this._width, this._height);
    }
    get translation() {
        return {
            x: this._entity.worldX,
            y: this._entity.worldY
        };
    }
}
