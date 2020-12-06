class CapricaMovementInput {
    constructor() {
        this.upBinding = new Binding("KeyW");
        this.rightBinding = new Binding("KeyD");
        this.downBinding = new Binding("KeyS");
        this.leftBinding = new Binding("KeyA");
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
        this.right.checkReleased(event);
        this.down.checkReleased(event);
        this.left.checkReleased(event);
    }
}
