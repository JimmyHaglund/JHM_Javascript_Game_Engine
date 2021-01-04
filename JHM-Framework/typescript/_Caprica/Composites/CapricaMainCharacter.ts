class CapricaMainCharacter {
    private _entity: Entity;
    private _rigidbody: IRigidbody;
    private _sprite: RotatedSprite;
    private _movementController: CapricaMovementController;
    private _input: CapricaMovementInput;
    private _lookCone:AimConeRenderer;
    private _aimConeController:AimConeController;
    private _lookController: CapricaLookController;

    public get entity() { return this._entity; }
    public get rigidbody() { return this._rigidbody; }
    public get sprite() { return this._sprite; }
    public get controller() { return this._movementController; }
    public get input() { return this._input; }

    constructor(xPosition: number, yPosition: number, loop: Loop,
        renderSpace: IRenderLayer, camera:Camera, physics: PhysicsSpace) {
        this._entity = new Entity(xPosition, yPosition);
        this.initialisePhysics(this._entity, physics);
        this.initialiseRendering(this._entity, renderSpace);
        this.initialiseMovementController(loop);
        this.initialiseAimConeController(loop, renderSpace, camera);
        this.initialiseLookController(camera, loop);
    }

    private initialisePhysics(entity: Entity, physics: PhysicsSpace): void {
        let rigidBody = new PointRigidBody(entity);
        rigidBody.dragEnabled = false;
        entity.addComponent(rigidBody);
        this._rigidbody = rigidBody;
        physics.addRigidbody(rigidBody);
    }

    private initialiseRendering(entity: Entity, renderSpace: IRenderLayer): void {
        this._sprite = new RotatedSprite(entity, "main_character");
        this._sprite.offsetX = -50;
        this._sprite.offsetY = -50;
        entity.addComponent(this._sprite);
        renderSpace.addRenderable(this._sprite);
    }

    private initialiseMovementController(loop: Loop): void {
        this._input = new CapricaMovementInput();
        this._movementController = new CapricaMovementController(this._input, this);
        loop.onUpdate.add(this._movementController.update, this._movementController);
    }

    private initialiseAimConeController(loop:Loop, renderSpace:IRenderLayer, camera:Camera) {
        this._lookCone = new AimConeRenderer(renderSpace, 300);
        this._aimConeController = new AimConeController(loop, this._entity.transform, this._lookCone, camera, new AimData(Math.PI * 0.5, Math.PI * 0.15, 0.5));
    }

    private initialiseLookController(camera:Camera, loop:ILoop) {
        this._lookController = new CapricaLookController(camera, this);
        loop.onUpdate.add(this._lookController.updateRotation, this._lookController);
    }

    private setupInputLog(input: CapricaMovementInput) {
        input.Up.onPressed.add(() => console.log("Up pressed, velocity: " + this._rigidbody.velocity.y), this);
        input.Up.onReleased.add(() => console.log("Up released"), this);
        input.Right.onPressed.add(() => console.log("Right pressed"), this);
        input.Down.onPressed.add(() => console.log("Down pressed"), this);
        input.Left.onPressed.add(() => console.log("Left pressed"), this);
    }
}