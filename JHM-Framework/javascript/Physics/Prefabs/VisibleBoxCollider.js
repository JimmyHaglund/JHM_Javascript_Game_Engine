class VisibleBoxCollider {
    constructor(posX, posY, width, height, renderSpace, collisionSpace, color = 'black', fill = false) {
        this._entity = new Entity(posX, posY);
        this._collider = new BoxCollider(this._entity, width, height);
        this._visual = new BoxColliderRenderer(this._collider, color, fill);
        this._entity.addComponent(this._collider);
        this._collider.onDestroy.add(this._visual.destroy, this._visual);
        renderSpace.addRenderable(this._visual);
        collisionSpace.addCollider(this._collider);
    }
    set outlineOnly(value) { this._visual.outlineOnly = value; }
    get entity() { return this._entity; }
    get collider() { return this._collider; }
}
