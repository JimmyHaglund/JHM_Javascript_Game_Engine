class CapricaMainCharacter {
    constructor(xPosition, yPosition, loop, renderSpace, physics) {
        this._entity = new Entity(xPosition, yPosition);
        let rigidBody = new PointRigidBody(this._entity, loop);
        this._physicsActor = rigidBody;
        this._sprite = new RotatedSprite(this._entity, "character_idle");
        this._entity.addComponent(rigidBody);
        this._entity.addComponent(this._sprite);
        renderSpace.addRenderComponent(this._sprite, 0);
        physics.addPhysicsActor(this._physicsActor);
    }
}
