class Camera {
    constructor(layers, transform, loop) {
        this._backgroundColor = "gray";
        this._mousePosition = { x: 0, y: 0 };
        this._onDestroy = new Action();
        this._transform = transform;
        this._layers = layers;
        loop.onUpdate.add(this.render, this);
        onMouseMoved.add(this.storeMousePosition, this);
    }
    get onDestroy() { return this._onDestroy; }
    ;
    get centreX() { return this._transform.worldX; }
    get centreY() { return this._transform.worldY; }
    get canvas() { return this._canvas; }
    get viewFrustum() {
        return new Rect(this.centreX - this.canvas.width * 0.5, this.centreY - this.canvas.height * 0.5, this.canvas.width, this.canvas.height);
    }
    get screenBounds() {
        let rect = this.canvas.getBoundingClientRect();
        let left = rect.left;
        let top = rect.top;
        let right = left + this.canvas.width;
        let bottom = top + this.canvas.height;
        return new Rect(left, top, right - left, bottom - top);
    }
    destroy() {
        this._canvas.remove();
    }
    setCanvas(canvas) {
        this._canvas = canvas;
        this._context = canvas.getContext("2d");
    }
    printCanvasProperties() {
        console.log("Camera canvas properties:");
        console.log("Width/Height: ", this.canvas.width, "/", this.canvas.height);
        console.log("Left/Top: ", this.canvas.style.left, "/", this.canvas.style.top);
        console.log("Positioning: ", this.canvas.style.position);
        console.log(this.canvas);
    }
    render() {
        this.paintBackground();
        for (let n = 0; n < this._layers.length; n++) {
            let offsetX = this._transform.worldX - this.canvas.width * 0.5;
            let offsetY = this._transform.worldY - this.canvas.height * 0.5;
            this._layers[n].render(this._context, offsetX, offsetY, this.viewFrustum);
        }
    }
    setBackgroundColor(color) {
        this._backgroundColor = color;
    }
    getMouseWorldPosition() {
        let cameraWorldRect = this.viewFrustum;
        let mouseCanvasPosition = this.getMouseCanvasPosition();
        let mouseWorldX = mouseCanvasPosition.x + cameraWorldRect.left;
        let mouseWorldY = mouseCanvasPosition.y + cameraWorldRect.top;
        return {
            x: mouseWorldX,
            y: mouseWorldY
        };
    }
    static createCanvas(screenLeft, screenTop, width, height, positioning) {
        let canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = canvas.height = height;
        canvas.style.position = positioning;
        canvas.width = width;
        canvas.height = height;
        canvas.style.left = screenLeft.toString() + "px";
        canvas.style.top = screenTop.toString() + "px";
        return (canvas);
    }
    getMouseCanvasPosition() {
        let cameraScreenRect = this.screenBounds;
        let mouseCanvasX = this._mousePosition.x - cameraScreenRect.left;
        let mouseCanvasY = this._mousePosition.y - cameraScreenRect.top;
        return {
            x: mouseCanvasX,
            y: mouseCanvasY
        };
    }
    storeMousePosition(event) {
        this._mousePosition = { x: event.x, y: event.y };
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
