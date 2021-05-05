class TiledBackground implements IRenderable, IDestroyable {
    public onDestroy = new Action();
    private _image: HTMLImageElement;
    private _spriteId: string;
    private _tileCount: {x:number, y:number};
    private _tileSize : {x:number, y:number};
    
    constructor(horizontalTileCount: number, verticalTileCount: number, spriteId: string = "") {
        this._tileCount = {x:horizontalTileCount, y:verticalTileCount};
        this._spriteId = spriteId;
        this._image = document.getElementById(spriteId) as HTMLImageElement;
        this._tileSize = this.getTileSize(this._image);
    }

    
    public render(renderContext: CanvasRenderingContext2D, viewX:number, viewY:number):void {
        // console.log("Rendering background tile at", viewX, viewY);
        for(let x = 0; x < this._tileCount.x; x++) {
            for (let y = 0; y < this._tileCount.y; y++) {
                let offsetX = x * this._tileSize.x - viewX;
                let offsetY = y * this._tileSize.y - viewY;
                this.renderTile(renderContext, offsetX, offsetY);
            }
        }
    }

    private getTileSize(image: HTMLImageElement): {x:number, y:number} {
        return {x:image.width, y:image.height};
    }

    private renderTile(context:CanvasRenderingContext2D, offsetX: number, offsetY: number):void {
        context.drawImage(this._image, offsetX, offsetY);
    }



    public destroy():void {

    }


}