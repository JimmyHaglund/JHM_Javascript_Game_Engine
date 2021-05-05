class MouseInput {
    constructor() {
        this._onMouseMove = new Action();
        this._onMouseDown = new Action();
        this._onMouseUp = new Action();
        document.addEventListener("mousemove", (event) => this.moveMouse.call(this, event));
        document.addEventListener("mousedown", (event) => this.mouseDown.call(this, event));
        document.addEventListener("mouseup", (event) => this.mouseUp.call(this, event));
    }
    get onMouseMove() { return this._onMouseMove; }
    get onMouseDown() { return this._onMouseDown; }
    get onMouseUp() { return this._onMouseUp; }
    moveMouse(event) {
        this._onMouseMove.invoke.call(this._onMouseMove, event);
    }
    mouseDown(event) {
        this._onMouseDown.invoke.call(this._onMouseDown, event);
    }
    mouseUp(event) {
        this._onMouseUp.invoke.call(this._onMouseUp, event);
    }
}
