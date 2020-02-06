class VisibleBoxCollider {
    constructor(posX, posY, width, height, renderSpace, physicsSpace, color = 'black') {
        this._entity = new Entity(posX, posY);
        this._collider = new BoxCollider(this._entity, width, height);
        this._visual = new BoxColliderRenderer(this._collider, color, true);
        this._entity.addComponent(this._collider);
        this._collider.onDestroy.add(this._visual.destroy, this._visual);
        renderSpace.addRenderComponent(this._visual, 10);
        physicsSpace.addCollider(this._collider);
    }
    set outlineOnly(value) { this._visual.outlineOnly = value; }
    get entity() { return this._entity; }
}
