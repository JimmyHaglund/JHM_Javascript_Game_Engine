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
        rigidBody.dragEnabled = false;
        entity.addComponent(rigidBody);
        this._rigidbody = rigidBody;
        physics.AddRigidbody(rigidBody);
    }
    InitialiseRendering(entity, renderSpace) {
        this._sprite = new RotatedSprite(entity, "main_character");
        this._sprite.offsetX = -50;
        this._sprite.offsetY = -50;
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
        input.Up.OnPressed.add(() => console.log("Up pressed, velocity: " + this._rigidbody.Velocity.y), this);
        input.Up.OnReleased.add(() => console.log("Up released"), this);
        input.Right.OnPressed.add(() => console.log("Right pressed"), this);
        input.Down.OnPressed.add(() => console.log("Down pressed"), this);
        input.Left.OnPressed.add(() => console.log("Left pressed"), this);
    }
}
