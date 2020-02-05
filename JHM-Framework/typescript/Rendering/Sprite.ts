
class Sprite implements IRenderable, IDestroyable {
    private _spriteId: string;
    private _image: HTMLImageElement;
    private _width: number;
    private _height: number;
    private _entity: Entity;
    private _crop: {
        width: number,
        height: number,
        offsetX: number,
        offsetY: number
    }
    private _alpha: number = 1;
    private _offsetX: number = 0;
    private _offsetY: number = 0;
    private _onDestroy = new Action();

    set alpha(value: number) { this._alpha = value; }
    get alpha(): number { return this._alpha; }
    set spriteId(value: string) {
        if (this._spriteId == value) return;
        this._spriteId = value;
        this._image = document.getElementById(this._spriteId) as HTMLImageElement;
    }
    set offsetX(value: number) { this._offsetX = value; }
    set offsetY(value: number) { this._offsetY = value; }
    get spriteId(): string { return this._spriteId; }
    get onDestroy(): Action { return this._onDestroy; }
    get width(): number { return this._width; }

    constructor(entity: Entity, spriteId: string = "", renderSpace: RenderSpace, layer: number = 0) {
        this._spriteId = spriteId;
        this._image = document.getElementById(spriteId) as HTMLImageElement;
        if (this._image != null) {
            this._width = this._image.naturalWidth;
            this._height = this._image.naturalHeight;
            this._crop = {
                width: this._width,
                height: this._height,
                offsetX: 0,
                offsetY: 0
            }
        }
        else {
            console.log("Warning: Sprite component with sprite id",
                spriteId, "failed to find an image.");
        }
        this._entity = entity;
        renderSpace.addRenderComponent(this, layer);
    }

    destroy(): void {
        this._onDestroy.invoke();
    }
    // Render image.
    render(context: CanvasRenderingContext2D) {
        if (this._image == null) return;
        let contextAlpha = context.globalAlpha;
        let worldX = this._entity.transform.worldX + this._offsetX;
        let worldY = this._entity.transform.worldY - this._offsetY;
        let translationX =
            worldX * Math.cos(0) - // If we were to rotate render space origin
            worldY * Math.sin(0);
        let translationY =
            worldX * Math.sin(0) +
            worldY * Math.cos(0);
        // Set context settings
        context.translate(translationX, translationY);
        // context.rotate(originRotation);
        context.globalAlpha = this._alpha;
        // console.log(entity.transform.worldY);
        // Render image to canvas.
        context.drawImage(
            this._image, // image
            this._crop.offsetX, // left crop rectangle
            this._crop.offsetY, // top crop rectangle
            this._crop.width, // crop rectangle width
            this._crop.height, // crop rectangle height
            -this._width / 2, // x coordinate relative to context position
            -this._height / 2, // y coordinate relative to context position
            this._width, // width of drawn image
            this._height // height of drawn image
        );
        // Restore context to original settings
        context.globalAlpha = contextAlpha;
        context.translate(-translationX, -translationY);
    }
}