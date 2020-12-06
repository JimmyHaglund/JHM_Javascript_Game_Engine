class CapricaMainCharacter {
    private _entity: Entity;
    private _rigidbody: IRigidbody;
    private _sprite: RotatedSprite;
    private _controller: CapricaMovementController;
    private _input: CapricaMovementInput;

    public get Entity() { return this._entity; }
    public get Rigidbody() { return this._rigidbody; }
    public get Sprite() { return this._sprite; }
    public get Controller() { return this._controller; }
    public get Input() { return this._input; }

    constructor(xPosition: number, yPosition: number, loop: Loop,
        renderSpace: RenderSpace, physics: PhysicsSpace) {
        this._entity = new Entity(xPosition, yPosition);
        this.InitialisePhysics(this._entity, physics);
        this.InitialiseRendering(this._entity, renderSpace);
        this.InitialiseController(loop);
    }

    private InitialisePhysics(entity: Entity, physics: PhysicsSpace): void {
        let rigidBody = new PointRigidBody(entity);
        entity.addComponent(rigidBody);
        this._rigidbody = rigidBody;
        physics.AddRigidbody(rigidBody);
    }

    private InitialiseRendering(entity: Entity, renderSpace: RenderSpace): void {
        this._sprite = new RotatedSprite(entity, "character_idle");
        entity.addComponent(this._sprite);
        renderSpace.addRenderComponent(this._sprite, 0);
    }

    private InitialiseController(loop: Loop): void {
        this._input = new CapricaMovementInput();
        this._controller = new CapricaMovementController(this._input, this);
        this.SetupInputLog(this._input);
        loop.onUpdate.add(this._controller.Update, this._controller);
    }

    private SetupInputLog(input: CapricaMovementInput) {
        input.up.onPressed.add(() => console.log("Up pressed, velocity: " + this._rigidbody.Velocity.y), this);
        input.up.onReleased.add(() => console.log("Up released"), this);
        input.right.onPressed.add(() => console.log("Right pressed"), this);
        input.down.onPressed.add(() => console.log("Down pressed"), this);
        input.left.onPressed.add(() => console.log("Left pressed"), this);
    }
}