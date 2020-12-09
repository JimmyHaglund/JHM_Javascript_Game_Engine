class Sprite implements IRenderable, IDestroyable, IComponent {
    protected _spriteId: string;
    protected _image: HTMLImageElement;
    protected _width: number;
    protected _height: number;
    protected _transform: ITransform;
    protected _crop: {
        width: number,
        height: number,
        offsetX: number,
        offsetY: number
    }
    protected _alpha: number = 1;
    protected _offsetX: number = 0;
    protected _offsetY: number = 0;
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
    set width(value: number) { this._width = value; }
    get height(): number { return this._width; }
    set height(value: number) { this._height = value; }
    get Transform(): ITransform { return this._transform; }

    constructor(transform: ITransform, spriteId: string = "") {
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
        this._transform = transform;
    }

    public destroy(): void {
        this._onDestroy.invoke();
    }
    // Render image.
    public render(context: CanvasRenderingContext2D):void {
        if (this._image == null) return;

        let contextSettings = {
            contextAlpha: context.globalAlpha,
            translation: this.translation,
            apply: function () {
                context.globalAlpha = this._alpha;
                context.translate(contextSettings.translation.x, contextSettings.translation.y);
            },
            reset: function () {
                context.globalAlpha = contextSettings.contextAlpha;
                context.translate(-contextSettings.translation.x, -contextSettings.translation.y);
            }
        }
        contextSettings.apply();
        this.drawSprite(context);
        contextSettings.reset();
    }

    protected drawSprite(context: CanvasRenderingContext2D): void {
        context.drawImage(
            this._image,
            this._crop.offsetX,
            this._crop.offsetY,
            this._crop.width,
            this._crop.height,
            this._offsetX,
            this._offsetY,
            this._width,
            this._height
        );
    }

    protected get translation(): { x: number, y: number } {
        return {
            x: this._transform.worldX,
            y: this._transform.worldY
        }
    }
}