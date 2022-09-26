class SpriteAnimator {
    private _loop: ILoop;
    private _layer: IRenderLayer;
    private _sprites: RotatedSprite[];
    private _cycleTime: number;
    private _enabled: boolean;
    private _index: number;
    private _deltaTime: number = 0;
    private _updateId: number;

    constructor(loop: ILoop, layer: IRenderLayer, sprites:RotatedSprite[], cycleTime:number = 0.25, enabled: boolean = true) {
        this._loop = loop;
        this._layer = layer;
        this._sprites = sprites;
        this._cycleTime = cycleTime;
        this._enabled = enabled;
        if (!enabled) return;
        this._updateId = loop.onUpdate.add(this.update, this);
    }

    public get Enabled(): boolean {return this._enabled;}
    public set Enabled(value: boolean) {
        if (value == this._enabled) return;
        this._enabled = value;
        if (!this._enabled) this._loop.onUpdate.remove(this._updateId);
        else this._updateId = this._loop.onUpdate.add(this.update, this);
    }

    public update(deltaTime: number): void {
        this._deltaTime += deltaTime;
        if (this._deltaTime > this._cycleTime) {
            this._deltaTime = 0;
            this.next();
        }
    }

    private next(): void {
        this._layer.removeRenderable(this._sprites[this._index]);
        if (++this._index >= this._sprites.length) this._index = 0;
        this._layer.addRenderable(this._sprites[this._index]);
    }
}