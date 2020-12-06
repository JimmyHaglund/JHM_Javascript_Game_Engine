class CapricaMainCharacter {
    constructor(xPosition, yPosition, loop, renderSpace, physics) {
        this._entity = new Entity(xPosition, yPosition);
        this.InitialisePhysics(this._entity, physics);
        this.InitialiseRendering(this._entity, renderSpace);
        this.InitialiseController(loop);
    }
    get Entity() { return this._entity; }
    get Rigidbody() { return this._rigidbody; }
    get Sprite() { return this._sprite; }
    get Controller() { return this._controller; }
    get Input() { return this._input; }
    InitialisePhysics(entity, physics) {
        let rigidBody = new PointRigidBody(entity);
        entity.addComponent(rigidBody);
        this._rigidbody = rigidBody;
        physics.AddRigidbody(rigidBody);
    }
    InitialiseRendering(entity, renderSpace) {
        this._sprite = new RotatedSprite(entity, "character_idle");
        entity.addComponent(this._sprite);
        renderSpace.addRenderComponent(this._sprite, 0);
    }
    InitialiseController(loop) {
        this._input = new CapricaMovementInput();
        this._controller = new CapricaMovementController(this._input, this);
        this.SetupInputLog(this._input);
        loop.onUpdate.add(this._controller.Update, this._controller);
    }
    SetupInputLog(input) {
        input.up.onPressed.add(() => console.log("Up pressed, velocity: " + this._rigidbody.Velocity.y), this);
        input.up.onReleased.add(() => console.log("Up released"), this);
        input.right.onPressed.add(() => console.log("Right pressed"), this);
        input.down.onPressed.add(() => console.log("Down pressed"), this);
        input.left.onPressed.add(() => console.log("Left pressed"), this);
    }
}
