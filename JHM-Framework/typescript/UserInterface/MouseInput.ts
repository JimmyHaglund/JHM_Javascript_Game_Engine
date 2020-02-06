class MouseInput {
    private _onMouseMove: Action;
    private _onMouseDown: Action;
    private _onMouseUp: Action;
    get onMouseMove(): Action { return this._onMouseMove; }
    get onMouseDown(): Action { return this._onMouseDown; }
    get onMouseUp(): Action { return this._onMouseUp; }

    constructor() {
        this._onMouseMove = new Action();
        this._onMouseDown = new Action();
        this._onMouseUp = new Action();
        document.addEventListener("mousemove", (event) => this.moveMouse.call(this, event));
        document.addEventListener("mousedown", (event) => this.mouseDown.call(this, event));
        document.addEventListener("mouseup", (event) => this.mouseUp.call(this, event));
    }

    private moveMouse(event: MouseEvent) {
        this._onMouseMove.invoke.call(this._onMouseMove, event);
    }

    private mouseDown(event: MouseEvent) {
        this._onMouseDown.invoke.call(this._onMouseDown, event);
    }
    private mouseUp(event: MouseEvent) {
        this._onMouseUp.invoke.call(this._onMouseUp, event);
    }
}