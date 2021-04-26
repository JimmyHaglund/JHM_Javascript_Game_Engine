class VisibleSphereCollider {
    private _entity: Entity;
    private _collider: BoxCollider;
    private _visual: BoxColliderRenderer;

    set outlineOnly(value: boolean) { this._visual.outlineOnly = value; }
    get entity(): Entity { return this._entity; }
    get collider(): BoxCollider { return this._collider; }

    constructor(posX: number, posY: number, width: number, height: number, 
        renderSpace: IRenderLayer, collisionSpace: CollisionSpace,
        color: string = 'black', fill = false) {
        this._entity = new Entity(posX, posY);
        this._collider = new BoxCollider(this._entity, width, height);
        this._visual = new BoxColliderRenderer(this._collider, color, fill);

        this._entity.addComponent(this._collider);
        this._collider.onDestroy.add(this._visual.destroy, this._visual);

        renderSpace.addRenderable(this._visual);
        collisionSpace.addCollider(this._collider);
    }
}