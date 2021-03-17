class CapricaMainCharacter {
    constructor(xPosition, yPosition, loop, renderSpace, camera, physics) {
        this._entity = new Entity(xPosition, yPosition);
        this.initialiseMovementController(loop);
        this.initialiseLookController(camera, loop);
        this.initialisePhysics(this._entity, physics);
        this.initialiseRendering(this._entity, renderSpace);
    }
    get entity() { return this._entity; }
    get rigidbody() { return this._rigidbody; }
    get sprite() { return this._sprite; }
    get controller() { return this._movementController; }
    get input() { return this._input; }
    get gun() { return this._gun; }
    assignGun(gun) {
        this._gun = gun;
    }
    initialisePhysics(entity, physics) {
        let rigidBody = new PointRigidBody(entity);
        rigidBody.dragEnabled = false;
        entity.addComponent(rigidBody);
        this._rigidbody = rigidBody;
        physics.addRigidbody(rigidBody);
    }
    initialiseRendering(entity, renderSpace) {
        this._sprite = new RotatedSprite(entity, "main_character");
        this._sprite.offsetX = -50;
        this._sprite.offsetY = -50;
        entity.addComponent(this._sprite);
        renderSpace.addRenderable(this._sprite);
    }
    initialiseMovementController(loop) {
        this._input = new CapricaMovementInput();
        this._movementController = new CapricaMovementController(this._input, this);
        loop.onUpdate.add(this._movementController.update, this._movementController);
    }
    initialiseLookController(camera, loop) {
        this._lookController = new CapricaLookController(camera, this);
        loop.onUpdate.add(this._lookController.updateRotation, this._lookController);
    }
    initialiseAimConeController(loop, renderSpace, camera) {
        this._lookCone = new AimConeRenderer(renderSpace, 300);
        return new AimController(loop, this._entity.transform, this._lookCone, camera, new AimData(Math.PI * 0.5, Math.PI * 0.15, 0.5));
    }
    setupInputLog(input) {
        input.Up.onPressed.add(() => console.log("Up pressed, velocity: " + this._rigidbody.velocity.y), this);
        input.Up.onReleased.add(() => console.log("Up released"), this);
        input.Right.onPressed.add(() => console.log("Right pressed"), this);
        input.Down.onPressed.add(() => console.log("Down pressed"), this);
        input.Left.onPressed.add(() => console.log("Left pressed"), this);
    }
}
