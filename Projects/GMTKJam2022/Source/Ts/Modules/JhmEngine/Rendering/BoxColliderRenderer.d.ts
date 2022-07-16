declare class BoxColliderRenderer implements IRenderable, IDestroyable {
    private _onDestroy;
    private _shouldFill;
    private _collider;
    private _color;
    get onDestroy(): Action;
    set outlineOnly(value: boolean);
    constructor(collider: BoxCollider, color?: string, fill?: boolean);
    render(context: CanvasRenderingContext2D, viewX: number, viewY: number): void;
    destroy(): void;
    renderOutline(context: CanvasRenderingContext2D, left: number, right: number, top: number, bottom: number): void;
    renderFill(context: CanvasRenderingContext2D, left: number, right: number, top: number, bottom: number): void;
}
