class MovementInput {
    private upBinding = new Binding("KeyW");
    private rightBinding = new Binding("KeyD");
    private downBinding = new Binding("KeyS");
    private leftBinding = new Binding("KeyA");

    public get up(): Binding { return this.upBinding; }
    public get right(): Binding { return this.rightBinding; }
    public get down(): Binding { return this.downBinding; }
    public get left(): Binding { return this.leftBinding; }

    constructor() {
        this.up.onPressed.push(() => console.log("Up pressed"));
        this.up.onReleased.push(() => console.log("Up released"));
        this.right.onPressed.push(() => console.log("Right pressed"));
        this.down.onPressed.push(() => console.log("Down pressed"));
        this.left.onPressed.push(() => console.log("Left pressed"));
    }

    public CheckPressed(event:KeyboardEvent): void {
        this.up.checkPressed(event);
        this.right.checkPressed(event);
        this.down.checkPressed(event);
        this.left.checkPressed(event);
    }

    public CheckReleased(event:KeyboardEvent):void {
        this.up.checkReleased(event);
    }
}