class MovementInput {
    constructor() {
        this.upBinding = new Binding("KeyW");
        this.rightBinding = new Binding("KeyD");
        this.downBinding = new Binding("KeyS");
        this.leftBinding = new Binding("KeyA");
        this.up.onPressed.push(() => console.log("Up pressed"));
        this.up.onReleased.push(() => console.log("Up released"));
        this.right.onPressed.push(() => console.log("Right pressed"));
        this.down.onPressed.push(() => console.log("Down pressed"));
        this.left.onPressed.push(() => console.log("Left pressed"));
    }
    get up() { return this.upBinding; }
    get right() { return this.rightBinding; }
    get down() { return this.downBinding; }
    get left() { return this.leftBinding; }
    CheckPressed(event) {
        this.up.checkPressed(event);
        this.right.checkPressed(event);
        this.down.checkPressed(event);
        this.left.checkPressed(event);
    }
    CheckReleased(event) {
        this.up.checkReleased(event);
    }
}
