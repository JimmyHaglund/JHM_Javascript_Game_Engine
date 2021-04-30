class CapricaMainCharacter {
    constructor(xPosition, yPosition, inputLoop, movementLoop, legRenderLayer, armRenderLayer, torsoRenderLayer, camera, physics) {
        this._entity = new Entity(xPosition, yPosition);
        this.initialiseMovementController(inputLoop);
        this.initialiseLookController(camera, inputLoop);
        this.initialisePhysics(this._entity, physics, movementLoop);
        this.generateSprites(movementLoop, this._entity.transform, legRenderLayer, armRenderLayer, torsoRenderLayer, this.controller);
    }
    get entity() { return this._entity; }
    get rigidbody() { return this._rigidbody; }
    get sprite() { return this._sprite; }
    get controller() { return this._movementController; }
    get input() { return this._input; }
    get gun() { return this._gun; }
    assignGun(gun) {
        this._gun = gun;
        gun.onTakeAim.add(this._sprite.startAim, this._sprite);
        gun.onStopAim.add(this._sprite.endAim, this._sprite);
    }
    initialisePhysics(entity, physics, movementLoop) {
        let rigidBody = new PointRigidBody(entity);
        rigidBody.dragEnabled = false;
        movementLoop.onUpdate.add(rigidBody.update, rigidBody);
        entity.addComponent(rigidBody);
        this._rigidbody = rigidBody;
        physics.addPhysicsActor(rigidBody);
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
    setupInputLog(input) {
        input.Up.onPressed.add(() => console.log("Up pressed, velocity: " + this._rigidbody.velocity.y), this);
        input.Up.onReleased.add(() => console.log("Up released"), this);
        input.Right.onPressed.add(() => console.log("Right pressed"), this);
        input.Down.onPressed.add(() => console.log("Down pressed"), this);
        input.Left.onPressed.add(() => console.log("Left pressed"), this);
    }
    generateSprites(loop, transform, renderLayerLegs, renderLayerArms, renderLayerTorso, movementController) {
        let ids = {
            legA: 'legsA',
            legB: 'legsB',
            armDown: 'armsDown',
            armUp: 'armsAim',
            torso: 'torso'
        };
        let legA = new RotatedSprite(transform, ids.legA);
        let legB = new RotatedSprite(transform, ids.legB);
        let armDown = new RotatedSprite(transform, ids.armDown);
        let armUp = new RotatedSprite(transform, ids.armUp);
        let torso = new RotatedSprite(transform, ids.torso);
        this._sprite = new CapricaMainCharacterSprite(loop, renderLayerLegs, renderLayerArms, renderLayerTorso, movementController)
            .withArms(armDown, armUp)
            .withLegs(legA, legB)
            .withTorso(torso);
    }
}
