class TiledBackground {
    constructor(horizontalTileCount, verticalTileCount, spriteId = "") {
        this.onDestroy = new Action();
        this._tileCount = { x: horizontalTileCount, y: verticalTileCount };
        this._spriteId = spriteId;
        this._image = document.getElementById(spriteId);
        this._tileSize = this.getTileSize(this._image);
    }
    render(renderContext, viewX, viewY) {
        // console.log("Rendering background tile at", viewX, viewY);
        for (let x = 0; x < this._tileCount.x; x++) {
            for (let y = 0; y < this._tileCount.y; y++) {
                let offsetX = x * this._tileSize.x - viewX;
                let offsetY = y * this._tileSize.y - viewY;
                this.renderTile(renderContext, offsetX, offsetY);
            }
        }
    }
    getTileSize(image) {
        return { x: image.width, y: image.height };
    }
    renderTile(context, offsetX, offsetY) {
        context.drawImage(this._image, offsetX, offsetY);
    }
    destroy() {
    }
}
