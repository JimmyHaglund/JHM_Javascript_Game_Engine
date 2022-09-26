class CapricaCharacter {
    constructor(xPosition, yPosition, inputLoop, movementLoop, legRenderLayer, armRenderLayer, torsoRenderLayer, camera, physics) {
        this._entity = new Entity(xPosition, yPosition);
        this.initialiseMovementController(inputLoop);
        this.initialisePhysics(this._entity, physics, movementLoop);
    }
    get entity() { return this._entity; }
    get rigidbody() { return this._rigidbody; }
    get sprite() { return this._sprite; }
    get controller() { return this._movementController; }
    get input() { return this._input; }
    get gun() { return this._gun; }
    setState(state) {
        if (state == 'dead') {
            // this.
        }
    }
    initialisePhysics(entity, physics, movementLoop) {
        const verts = [
            { x: -20, y: -20 },
            { x: -20, y: 20 },
            { x: 20, y: 20 },
            { x: 20, y: -20 }
        ];
        let collider = new SatCollider(entity, 0, 0, verts);
        let rigidBody = new RigidBody(entity, collider);
        rigidBody.dragEnabled = false;
        movementLoop.onUpdate.add(rigidBody.update, rigidBody);
        entity.addComponent(rigidBody, Type.pointRigidbody);
        this._rigidbody = rigidBody;
        physics.addPhysicsActor(rigidBody);
    }
    initialiseMovementController(loop) { }
}
