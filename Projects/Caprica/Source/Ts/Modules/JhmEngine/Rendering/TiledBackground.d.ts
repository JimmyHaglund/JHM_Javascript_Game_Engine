declare class TiledBackground implements IRenderable, IDestroyable {
    onDestroy: Action;
    private _image;
    private _spriteId;
    private _tileCount;
    private _tileSize;
    constructor(horizontalTileCount: number, verticalTileCount: number, spriteId?: string);
    render(renderContext: CanvasRenderingContext2D, viewX: number, viewY: number): void;
    private getTileSize;
    private renderTile;
    destroy(): void;
}
