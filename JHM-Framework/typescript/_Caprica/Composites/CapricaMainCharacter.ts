class CapricaMainCharacter {
    private _entity :Entity;
    private _physicsActor: IPhysicsActor;
    private _sprite:Sprite;
    
    constructor(xPosition:number, yPosition:number, loop:Loop, 
        renderSpace: RenderSpace, physics: PhysicsSpace) {
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