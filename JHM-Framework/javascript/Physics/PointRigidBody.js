class PointRigidBody {
    constructor(entity, loop) {
        this._velocityX = 0;
        this._velocityY = 0;
        this._onDestroy = new Action();
        this._entity = entity;
        this._loopAction = loop.onUpdate;
        this._updateActionId = loop.onUpdate.add(this.update, this);
    }
    get velocityX() { return this._velocityX; }
    get velocityY() { return this._velocityY; }
    set velocityX(value) { this._velocityX = value; }
    set velocityY(value) { this._velocityY = value; }
    get onDestroy() { return this._onDestroy; }
    get entity() { return this._entity; }
    setVelocity(velocityX, velocityY) {
        this._velocityX = velocityX;
        this._velocityY = velocityY;
    }
    update(deltaTime) {
        if (deltaTime == undefined || deltaTime <= 0)
            return;
        this._entity.transform.x += deltaTime * this._velocityX;
        this._entity.transform.y += deltaTime * this._velocityY;
    }
    destroy() {
        this._loopAction.remove(this._updateActionId);
        this._onDestroy.invoke();
    }
    checkCollision(colliders) {
    }
}
