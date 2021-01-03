class CapricaMainCharacter {
    private _entity: Entity;
    private _rigidbody: IRigidbody;
    private _sprite: RotatedSprite;
    private _controller: CapricaMovementController;
    private _input: CapricaMovementInput;
    private _lookCone:AimConeRenderer;
    private _lookController:AimConeController;

    public get entity() { return this._entity; }
    public get rigidbody() { return this._rigidbody; }
    public get sprite() { return this._sprite; }
    public get controller() { return this._controller; }
    public get input() { return this._input; }

    constructor(xPosition: number, yPosition: number, loop: Loop,
        renderSpace: RenderLayer, physics: PhysicsSpace) {
        this._entity = new Entity(xPosition, yPosition);
        this.initialisePhysics(this._entity, physics);
        this.initialiseRendering(this._entity, renderSpace);
        this.initialiseController(loop);
        this.initialiseAimCone(loop, renderSpace);
    }

    private initialisePhysics(entity: Entity, physics: PhysicsSpace): void {
        let rigidBody = new PointRigidBody(entity);
        rigidBody.dragEnabled = false;
        entity.addComponent(rigidBody);
        this._rigidbody = rigidBody;
        physics.addRigidbody(rigidBody);
    }

    private initialiseRendering(entity: Entity, renderSpace: RenderLayer): void {
        this._sprite = new RotatedSprite(entity, "main_character");
        this._sprite.offsetX = -50;
        this._sprite.offsetY = -50;
        entity.addComponent(this._sprite);
        renderSpace.addRenderComponent(this._sprite, 0);
    }

    private initialiseController(loop: Loop): void {
        this._input = new CapricaMovementInput();
        this._controller = new CapricaMovementController(this._input, this);
        loop.onUpdate.add(this._controller.update, this._controller);
    }

    private initialiseAimCone(loop:Loop, renderSpace:RenderLayer) {
        this._lookCone = new AimConeRenderer(renderSpace, 300);
        this._lookController = new AimConeController(loop, this._entity.transform, this._lookCone);
    }

    private setupInputLog(input: CapricaMovementInput) {
        input.Up.onPressed.add(() => console.log("Up pressed, velocity: " + this._rigidbody.velocity.y), this);
        input.Up.onReleased.add(() => console.log("Up released"), this);
        input.Right.onPressed.add(() => console.log("Right pressed"), this);
        input.Down.onPressed.add(() => console.log("Down pressed"), this);
        input.Left.onPressed.add(() => console.log("Left pressed"), this);
    }
}