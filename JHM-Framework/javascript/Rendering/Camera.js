class Camera {
    constructor(layers, transform, loop) {
        this.onDestroy = new Action();
        this._backgroundColor = "gray";
        this._transform = transform;
        this._layers = layers;
        loop.onUpdate.add(this.render, this);
    }
    get centreX() { return this._transform.worldX; }
    get centreY() { return this._transform.worldY; }
    get canvas() { return this._canvas; }
    get viewFrustum() {
        return new Rect(this.centreX + this._frustumWidth * 0.5, this.centreX - this._frustumWidth * 0.5, this.centreY - this._frustumWidth * 0.5, this.centreY + this._frustumHeight * 0.5);
    }
    get screenBounds() {
        return new Rect(parseInt(this._canvas.style.right, 10), parseInt(this._canvas.style.left, 10), parseInt(this._canvas.style.top, 10), parseInt(this._canvas.style.bottom, 10));
    }
    destroy() {
        this._canvas.remove();
    }
    createCanvas(screenLeft, screenTop, width, height) {
        let canvas = document.createElement("canvas");
        this._context = canvas.getContext("2d");
        canvas.width = width;
        canvas.height = height;
        canvas.style.left = screenLeft.toString();
        canvas.style.top = screenTop.toString();
        return (this._canvas = canvas);
    }
    addToDocument() {
        document.body.insertBefore(this._canvas, document.body.childNodes[0]);
    }
    render() {
        this.paintBackground();
        for (let n = 0; n < this._layers.length; n++) {
            let layer = this._layers[n];
            let offsetX = this._transform.worldX - this.canvas.width * 0.5;
            let offsetY = this._transform.worldY - this.canvas.height * 0.5;
            this._layers[n].render(this._context, offsetX, offsetY, this.viewFrustum);
        }
    }
    setBackgroundColor(color) {
        this._backgroundColor = color;
    }
    paintBackground() {
        let wipe = () => {
            let screenBounds = this.screenBounds;
            this._context.clearRect(screenBounds.left, screenBounds.top, this.canvas.width, this.canvas.height);
        };
        wipe();
        this._context.fillStyle = this._backgroundColor;
        this._context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
