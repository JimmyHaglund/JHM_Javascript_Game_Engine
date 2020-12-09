class CapricaMainCharacter {
    private _entity: Entity;
    private _rigidbody: IRigidbody;
    private _sprite: RotatedSprite;
    private _controller: CapricaMovementController;
    private _input: CapricaMovementInput;

    public get entity() { return this._entity; }
    public get rigidbody() { return this._rigidbody; }
    public get sprite() { return this._sprite; }
    public get controller() { return this._controller; }
    public get input() { return this._input; }

    constructor(xPosition: number, yPosition: number, loop: Loop,
        renderSpace: RenderSpace, physics: PhysicsSpace) {
        this._entity = new Entity(xPosition, yPosition);
        this.initialisePhysics(this._entity, physics);
        this.initialiseRendering(this._entity, renderSpace);
        this.initialiseController(loop);
    }

    private initialisePhysics(entity: Entity, physics: PhysicsSpace): void {
        let rigidBody = new PointRigidBody(entity);
        rigidBody.dragEnabled = false;
        entity.addComponent(rigidBody);
        this._rigidbody = rigidBody;
        physics.addRigidbody(rigidBody);
    }

    private initialiseRendering(entity: Entity, renderSpace: RenderSpace): void {
        this._sprite = new RotatedSprite(entity, "main_character");
        this._sprite.offsetX = -50;
        this._sprite.offsetY = -50;
        entity.addComponent(this._sprite);
        renderSpace.addRenderComponent(this._sprite, 0);
    }

    private initialiseController(loop: Loop): void {
        this._input = new CapricaMovementInput();
        this._controller = new CapricaMovementController(this._input, this);
        this.setupInputLog(this._input);
        loop.onUpdate.add(this._controller.update, this._controller);
    }

    private setupInputLog(input: CapricaMovementInput) {
        input.Up.onPressed.add(() => console.log("Up pressed, velocity: " + this._rigidbody.velocity.y), this);
        input.Up.onReleased.add(() => console.log("Up released"), this);
        input.Right.onPressed.add(() => console.log("Right pressed"), this);
        input.Down.onPressed.add(() => console.log("Down pressed"), this);
        input.Left.onPressed.add(() => console.log("Left pressed"), this);
    }
}