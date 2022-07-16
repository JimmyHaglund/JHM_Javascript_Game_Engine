declare class ClassId {
    private _implementedClasses;
    constructor(implementedClasses: ClassId[]);
    Implements(target: ClassId): boolean;
}
declare let Type: {
    iComponent: ClassId;
    iDestroyable: ClassId;
    iLoop: ClassId;
    iTransform: ClassId;
    action: ClassId;
    entity: ClassId;
    loop: ClassId;
    rect: ClassId;
    transform: ClassId;
    boxCollider: ClassId;
    collisionSpace: ClassId;
    iCollider: ClassId;
    iDragProfile: ClassId;
    iRigidbody: ClassId;
    percentageDrag: ClassId;
    physicsSpace: ClassId;
    pointRigidbody: ClassId;
    rayRender: ClassId;
    rigidbody: ClassId;
    sphereCollider: ClassId;
    boxColliderRenderer: ClassId;
    camera: ClassId;
    circleRenderer: ClassId;
    iRenderable: ClassId;
    iRenderLayer: ClassId;
    renderLayer: ClassId;
    rotatedSprite: ClassId;
    sprite: ClassId;
    tiledBackground: ClassId;
};
