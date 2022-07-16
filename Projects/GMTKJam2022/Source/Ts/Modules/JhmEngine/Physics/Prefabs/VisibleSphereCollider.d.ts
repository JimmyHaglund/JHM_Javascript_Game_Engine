declare class VisibleSphereCollider {
    private _entity;
    private _collider;
    private _visual;
    set outlineOnly(value: boolean);
    get entity(): Entity;
    get collider(): BoxCollider;
    constructor(posX: number, posY: number, width: number, height: number, renderSpace: IRenderLayer, collisionSpace: CollisionSpace, color?: string, fill?: boolean);
}
