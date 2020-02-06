class VisibleBoxCollider {
    private _entity: Entity;
    private _collider: BoxCollider;
    private _visual: BoxColliderRenderer;

    set outlineOnly(value: boolean) { this._visual.outlineOnly = value; }
    get entity(): Entity { return this._entity; }

    constructor(posX: number, posY: number, width: number, height: number, renderSpace: RenderSpace, physicsSpace: PhysicsSpace, color: string = 'black') {
        this._entity = new Entity(posX, posY);
        this._collider = new BoxCollider(this._entity, width, height);
        this._visual = new BoxColliderRenderer(this._collider, color, true);

        this._entity.addComponent(this._collider);
        this._collider.onDestroy.add(this._visual.destroy, this._visual);

        renderSpace.addRenderComponent(this._visual, 10);
        physicsSpace.addCollider(this._collider);
    }
}