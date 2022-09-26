class SpriteAnimator {
    constructor(loop, layer, sprites, cycleTime = 0.25, enabled = true) {
        this._deltaTime = 0;
        this._loop = loop;
        this._layer = layer;
        this._sprites = sprites;
        this._cycleTime = cycleTime;
        this._enabled = enabled;
        if (!enabled)
            return;
        this._updateId = loop.onUpdate.add(this.update, this);
    }
    get Enabled() { return this._enabled; }
    set Enabled(value) {
        if (value == this._enabled)
            return;
        this._enabled = value;
        if (!this._enabled)
            this._loop.onUpdate.remove(this._updateId);
        else
            this._updateId = this._loop.onUpdate.add(this.update, this);
    }
    update(deltaTime) {
        this._deltaTime += deltaTime;
        if (this._deltaTime > this._cycleTime) {
            this._deltaTime = 0;
            this.next();
        }
    }
    next() {
        this._layer.removeRenderable(this._sprites[this._index]);
        if (++this._index >= this._sprites.length)
            this._index = 0;
        this._layer.addRenderable(this._sprites[this._index]);
    }
}
