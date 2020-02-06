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
    destroy() {
        this._onDestroy.invoke();
    }
    // Render image.
    render(context) {
        if (this._image == null)
            return;
        let contextAlpha = context.globalAlpha;
        let worldX = this._entity.transform.worldX + this._offsetX;
        let worldY = this._entity.transform.worldY + this._offsetY;
        let translationX = worldX * Math.cos(0) - // If we were to rotate render space origin
            worldY * Math.sin(0);
        let translationY = worldX * Math.sin(0) +
            worldY * Math.cos(0);
        // Set context settings
        context.translate(translationX, translationY);
        // context.rotate(originRotation);
        context.globalAlpha = this._alpha;
        // console.log(entity.transform.worldY);
        // Render image to canvas.
        context.drawImage(this._image, // image
        this._crop.offsetX, this._crop.offsetY, this._crop.width, // crop rectangle width
        this._crop.height, // crop rectangle height
        this._offsetX, this._offsetY, this._width, // width of drawn image
        this._height // height of drawn image
        );
        // Restore context to original settings
        context.globalAlpha = contextAlpha;
        context.translate(-translationX, -translationY);
    }
}
