class CapricaMainCharacter {
    private _entity: Entity;
    private _rigidbody: IRigidbody;
    // private _sprite: RotatedSprite;
    private _movementController: CapricaMovementController;
    private _input: CapricaMovementInput;
    private _lookCone:AimConeRenderer;
    private _lookController: CapricaLookController;
    private _gun: Gun;
    private _sprite: CapricaMainCharacterSprite;

    public get entity() { return this._entity; }
    public get rigidbody() { return this._rigidbody; }
    public get sprite() { return this._sprite; }
    public get controller() { return this._movementController; }
    public get input() { return this._input; }
    public get gun() { return this._gun; }

    constructor(xPosition: number, yPosition: number, inputLoop: Loop, movementLoop: Loop,
        legRenderLayer: IRenderLayer, armRenderLayer: IRenderLayer, torsoRenderLayer:IRenderLayer,
         camera:Camera, physics: PhysicsSpace) {
        this._entity = new Entity(xPosition, yPosition);
        this.initialiseMovementController(inputLoop);
        this.initialiseLookController(camera, inputLoop);
        this.initialisePhysics(this._entity, physics, movementLoop);
        this.generateSprites(movementLoop, this._entity.transform, legRenderLayer, armRenderLayer, torsoRenderLayer, this.controller);
    }

    public assignGun(gun:Gun): void {
        this._gun = gun;
        gun.onTakeAim.add(this._sprite.startAim, this._sprite);
        gun.onStopAim.add(this._sprite.endAim, this._sprite);
    }

    private initialisePhysics(entity: Entity, physics: PhysicsSpace, movementLoop: Loop): void {
        let rigidBody = new PointRigidBody(entity);
        rigidBody.dragEnabled = false;
        movementLoop.onUpdate.add(rigidBody.update, rigidBody);
        entity.addComponent(rigidBody);
        this._rigidbody = rigidBody;
        physics.addPhysicsActor(rigidBody);
    }

    private initialiseMovementController(loop: Loop): void {
        this._input = new CapricaMovementInput();
        this._movementController = new CapricaMovementController(this._input, this);
        loop.onUpdate.add(this._movementController.update, this._movementController);
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

    private generateSprites(loop:ILoop, transform:Transform, 
        renderLayerLegs: IRenderLayer, renderLayerArms: IRenderLayer, renderLayerTorso: IRenderLayer,
        movementController: CapricaMovementController) {
        let ids = {
            legA: 'legsA',
            legB: 'legsB',
            armDown: 'armsDown',
            armUp: 'armsAim',
            torso: 'torso'
        }
        let legA = new RotatedSprite(transform, ids.legA);
        let legB = new RotatedSprite(transform, ids.legB);
        let armDown = new RotatedSprite(transform, ids.armDown)
        let armUp = new RotatedSprite(transform, ids.armUp);
        let torso = new RotatedSprite(transform, ids.torso);

        this._sprite = new CapricaMainCharacterSprite(loop, renderLayerLegs, renderLayerArms, renderLayerTorso, movementController)
            .withArms(armDown, armUp)
            .withLegs(legA, legB)
            .withTorso(torso);
    }
    /*
    private initialiseRendering(entity: Entity, renderSpace: IRenderLayer): void {
        this._sprite = new RotatedSprite(entity, "main_character");
        this._sprite.offsetX = -50;
        this._sprite.offsetY = -50;
        entity.addComponent(this._sprite);
        renderSpace.addRenderable(this._sprite);
    }/**/
}