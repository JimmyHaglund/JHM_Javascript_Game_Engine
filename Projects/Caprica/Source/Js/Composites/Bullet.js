class Bullet {
    constructor(xPosition, yPosition, spriteId, colliderDiameter, renderLayer) {
        this._onDestroy = new Action();
        const collider = createSatBox(colliderDiameter).collider;
        this._collider = collider;
        this._entity = collider.entity;
        this._rigidbody = new RigidBody(this._entity, this._collider);
        this._rigidbody.dragEnabled = false;
        this._sprite = new RotatedSprite(this._entity, spriteId);
        this._rigidbody.onCollisionEnter.add(this.onHit, this);
        this._renderLayer = renderLayer;
    }
    get onDestroy() { return this._onDestroy; }
    get entity() { return this._entity; }
    get rigidbody() { return this._rigidbody; }
    enable() {
        this._renderLayer.addRenderable(this._sprite);
    }
    disable() {
        this._renderLayer.removeRenderable(this._sprite);
        this._rigidbody.velocity = { x: 0, y: 0 };
    }
    onHit(collisionData, collider) {
        this.disable();
    }
}
