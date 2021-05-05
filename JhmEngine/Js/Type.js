class ClassId {
    constructor(implementedClasses) {
        this._implementedClasses = implementedClasses;
    }
    Implements(target) {
        if (target === this)
            return true;
        if (this._implementedClasses === null)
            return false;
        for (let n = 0; n < this._implementedClasses.length; n++) {
            if (this._implementedClasses[n].Implements(target))
                return true;
        }
        return false;
    }
}
let Type = {
    iComponent: new ClassId(null),
    iDestroyable: new ClassId(null),
    iLoop: new ClassId(null),
    iTransform: new ClassId(null),
    action: new ClassId(null),
    entity: new ClassId(null),
    loop: new ClassId(null),
    rect: new ClassId(null),
    transform: new ClassId(null),
    // Physics
    boxCollider: new ClassId(null),
    collisionSpace: new ClassId(null),
    iCollider: new ClassId(null),
    iDragProfile: new ClassId(null),
    iRigidbody: new ClassId(null),
    percentageDrag: new ClassId(null),
    physicsSpace: new ClassId(null),
    pointRigidbody: new ClassId(null),
    rayRender: new ClassId(null),
    rigidbody: new ClassId(null),
    sphereCollider: new ClassId(null),
    // Rendering
    boxColliderRenderer: new ClassId(null),
    camera: new ClassId(null),
    circleRenderer: new ClassId(null),
    iRenderable: new ClassId(null),
    iRenderLayer: new ClassId(null),
    renderLayer: new ClassId(null),
    rotatedSprite: new ClassId(null),
    sprite: new ClassId(null),
    tiledBackground: new ClassId(null)
};
Type.entity = new ClassId([Type.iDestroyable, Type.iTransform]);
Type.transform = new ClassId([Type.iTransform]);
Type.loop = new ClassId([Type.iLoop]);
// Rendering
Type.boxColliderRenderer = new ClassId([Type.iRenderable, Type.iDestroyable]);
Type.camera = new ClassId([Type.iDestroyable]);
Type.circleRenderer = new ClassId([Type.iRenderable, Type.iDestroyable]);
Type.renderLayer = new ClassId([Type.iRenderLayer]);
Type.sprite = new ClassId([Type.iRenderable, Type.iDestroyable, Type.iComponent]);
Type.rotatedSprite = new ClassId([Type.sprite]);
