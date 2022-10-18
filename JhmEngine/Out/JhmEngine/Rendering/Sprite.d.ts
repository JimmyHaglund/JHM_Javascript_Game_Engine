declare class Sprite implements IRenderable, IDestroyable, IComponent {
    protected _spriteId: string;
    protected _image: HTMLImageElement;
    protected _width: number;
    protected _height: number;
    protected _entity: Entity;
    protected _crop: {
        width: number;
        height: number;
        offsetX: number;
        offsetY: number;
    };
    protected _alpha: number;
    protected _offsetX: number;
    protected _offsetY: number;
    private _onDestroy;
    set alpha(value: number);
    get alpha(): number;
    set spriteId(value: string);
    set offsetX(value: number);
    set offsetY(value: number);
    get spriteId(): string;
    get onDestroy(): Action;
    get width(): number;
    set width(value: number);
    get height(): number;
    set height(value: number);
    get entity(): Entity;
    get rotation(): number;
    constructor(entity: Entity, spriteId?: string);
    destroy(): void;
    render(context: CanvasRenderingContext2D, viewX: number, viewY: number): void;
    private renderNonRotated;
    private renderRotated;
    protected drawSprite(context: CanvasRenderingContext2D): void;
    protected get translation(): {
        x: number;
        y: number;
    };
}
