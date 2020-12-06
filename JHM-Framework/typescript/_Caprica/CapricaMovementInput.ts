class CapricaMovementInput {
    private upBinding = new Binding("KeyW");
    private rightBinding = new Binding("KeyD");
    private downBinding = new Binding("KeyS");
    private leftBinding = new Binding("KeyA");

    public get up(): Binding { return this.upBinding; }
    public get right(): Binding { return this.rightBinding; }
    public get down(): Binding { return this.downBinding; }
    public get left(): Binding { return this.leftBinding; }

    public CheckPressed(event:KeyboardEvent): void {
        this.up.checkPressed(event);
        this.right.checkPressed(event);
        this.down.checkPressed(event);
        this.left.checkPressed(event);
    }

    public CheckReleased(event:KeyboardEvent):void {
        this.up.checkReleased(event);
        this.right.checkReleased(event);
        this.down.checkReleased(event);
        this.left.checkReleased(event);
    }
}