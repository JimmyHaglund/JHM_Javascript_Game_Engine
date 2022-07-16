class MovementInput {
    private _upBinding = new Binding("KeyW");
    private _rightBinding = new Binding("KeyD");
    private _downBinding = new Binding("KeyS");
    private _leftBinding = new Binding("KeyA");

    public get Up(): Binding { return this._upBinding; }
    public get Right(): Binding { return this._rightBinding; }
    public get Down(): Binding { return this._downBinding; }
    public get Left(): Binding { return this._leftBinding; }

    public CheckPressed(event:KeyboardEvent): void {
        this.Up.checkPressed(event);
        this.Right.checkPressed(event);
        this.Down.checkPressed(event);
        this.Left.checkPressed(event);
    }

    public CheckReleased(event:KeyboardEvent):void {
        this.Up.checkReleased(event);
        this.Right.checkReleased(event);
        this.Down.checkReleased(event);
        this.Left.checkReleased(event);
    }
}