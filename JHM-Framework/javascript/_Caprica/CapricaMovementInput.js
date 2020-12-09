class CapricaMovementInput {
    constructor() {
        this._upBinding = new Binding("KeyW");
        this._rightBinding = new Binding("KeyD");
        this._downBinding = new Binding("KeyS");
        this._leftBinding = new Binding("KeyA");
    }
    get Up() { return this._upBinding; }
    get Right() { return this._rightBinding; }
    get Down() { return this._downBinding; }
    get Left() { return this._leftBinding; }
    CheckPressed(event) {
        this.Up.checkPressed(event);
        this.Right.checkPressed(event);
        this.Down.checkPressed(event);
        this.Left.checkPressed(event);
    }
    CheckReleased(event) {
        this.Up.checkReleased(event);
        this.Right.checkReleased(event);
        this.Down.checkReleased(event);
        this.Left.checkReleased(event);
    }
}
