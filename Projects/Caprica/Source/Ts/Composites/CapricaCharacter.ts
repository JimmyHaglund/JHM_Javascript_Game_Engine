class CapricaCharacter {
    private _entity: Entity;
    private _rigidbody: IRigidbody;
    // private _sprite: RotatedSprite;
    private _movementController: CapricaMovementController;
    private _input: CapricaMovementInput;
    private _lookCone:AimConeRenderer;
    private _lookController: CapricaLookController;
    private _gun: Gun;
    private _sprite: CapricaCharacterSprite;

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
        this.initialisePhysics(this._entity, physics, movementLoop);
    }

    public setState(state:string):void {
        if (state=='dead') {
            // this.
        }
        
    }

    private initialisePhysics(entity: Entity, physics: PhysicsSpace, movementLoop: Loop): void {
        const verts = [
            {x: -20, y: -20},
            {x: -20, y: 20},
            {x: 20, y: 20},
            {x: 20, y: -20}
        ];
        let collider = new SatCollider(entity, 0, 0, verts);
        let rigidBody = new RigidBody(entity, collider);
        rigidBody.dragEnabled = false;
        movementLoop.onUpdate.add(rigidBody.update, rigidBody);
        entity.addComponent(rigidBody, Type.pointRigidbody);
        this._rigidbody = rigidBody;
        physics.addPhysicsActor(rigidBody);
    }
    

    protected initialiseMovementController(loop: Loop): void { }
}