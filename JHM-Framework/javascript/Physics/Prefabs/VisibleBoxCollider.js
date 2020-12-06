class VisibleBoxCollider {
    constructor(posX, posY, width, height, renderSpace, physicsSpace, color = 'black', fill = false) {
        this._entity = new Entity(posX, posY);
        this._collider = new BoxCollider(this._entity, width, height);
        this._visual = new BoxColliderRenderer(this._collider, color, fill);
        this._entity.addComponent(this._collider);
        this._collider.onDestroy.add(this._visual.Destroy, this._visual);
        renderSpace.addRenderComponent(this._visual, 10);
        physicsSpace.AddCollider(this._collider);
    }
    set outlineOnly(value) { this._visual.outlineOnly = value; }
    get entity() { return this._entity; }
    get collider() { return this._collider; }
}
