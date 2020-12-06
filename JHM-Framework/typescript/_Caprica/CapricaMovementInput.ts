class CapricaMovementInput {
    private _upBinding = new Binding("KeyW");
    private _rightBinding = new Binding("KeyD");
    private _downBinding = new Binding("KeyS");
    private _leftBinding = new Binding("KeyA");

    public get Up(): Binding { return this._upBinding; }
    public get Right(): Binding { return this._rightBinding; }
    public get Down(): Binding { return this._downBinding; }
    public get Left(): Binding { return this._leftBinding; }

    public CheckPressed(event:KeyboardEvent): void {
        this.Up.CheckPressed(event);
        this.Right.CheckPressed(event);
        this.Down.CheckPressed(event);
        this.Left.CheckPressed(event);
    }

    public CheckReleased(event:KeyboardEvent):void {
        this.Up.CheckReleased(event);
        this.Right.CheckReleased(event);
        this.Down.CheckReleased(event);
        this.Left.CheckReleased(event);
    }
}