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
        this.Up.CheckPressed(event);
        this.Right.CheckPressed(event);
        this.Down.CheckPressed(event);
        this.Left.CheckPressed(event);
    }
    CheckReleased(event) {
        this.Up.CheckReleased(event);
        this.Right.CheckReleased(event);
        this.Down.CheckReleased(event);
        this.Left.CheckReleased(event);
    }
}
