class Camera {
    constructor(layers, transform, loop) {
        this.positionY = 0;
        this._transform = transform;
        this._layers = layers;
        loop.onUpdate.add(this.render, this);
    }
    get centreX() { return; }
    render() {
        for (let n = 0; n < this._layers.length; n++) {
            let layer = this._layers[n];
            let offsetX = -this._transform.x + layer.canvas.width * 0.5;
            let offsetY = -this._transform.y + layer.canvas.height * 0.5;
            this._layers[n].render(offsetX, offsetY);
        }
    }
}
