class PointRigidBody {
    constructor(entity, loop) {
        this._velocityX = 0;
        this._velocityY = 0;
        this._onDestroy = new Action();
        this._onCollisionEnter = new Action();
        this._onCollisionExit = new Action();
        this._onCollisionStay = new Action();
        this._entity = entity;
        this._loopAction = loop.onUpdate;
        this._updateActionId = loop.onUpdate.add(this.update, this);
        this._previousX = entity.transform.x;
        this._previousY = entity.transform.y;
    }
    /*
    // TODO: Implement collision stay & triggers
    private readonly _activeCollisionData: {
        collider: ICollider,
        updateCount: number,
        lastUpdateCount: number
    }[] = [];
    */
    get velocityX() { return this._velocityX; }
    get velocityY() { return this._velocityY; }
    set velocityX(value) { this._velocityX = value; }
    set velocityY(value) { this._velocityY = value; }
    get onCollisionEnter() { return this._onCollisionEnter; }
    get onCollisionExit() { return this._onCollisionExit; }
    get onCollisionStay() { return this._onCollisionStay; }
    get onDestroy() { return this._onDestroy; }
    get entity() { return this._entity; }
    setVelocity(velocityX, velocityY) {
        this._velocityX = velocityX;
        this._velocityY = velocityY;
    }
    update(deltaTime) {
        this._deltaTime = deltaTime;
    }
    destroy() {
        this._loopAction.remove(this._updateActionId);
        this._onDestroy.invoke();
    }
    checkCollision(colliders) {
        this.move(this._deltaTime);
        colliders.forEach(collider => {
            if (collider.overlapsPoint(this._entity.transform.x, this._entity.transform.y)) {
                let x0 = this._previousX;
                let y0 = this._previousY;
                let x1 = this._entity.transform.x;
                let y1 = this._entity.transform.y;
                let dX = this._entity.transform.x - this._previousX;
                let dY = this._entity.transform.y - this._previousY;
                let lean = dY / dX;
                if (dX == 0)
                    lean = 100000;
                let collisionData = collider.getCollisionPointWithRay(x0, y0, dX, dY);
                let deltaColX = collisionData.x - x1;
                let deltaColY = collisionData.y - y1;
                this._velocityX -= collisionData.normalX * this._velocityX * -Math.sign(dX);
                this._velocityY -= collisionData.normalY * this._velocityY * -Math.sign(dY);
                this._entity.transform.x -= collisionData.normalX * deltaColX * -Math.sign(deltaColX);
                this._entity.transform.y -= collisionData.normalY * deltaColY * -Math.sign(deltaColY);
                this._onCollisionEnter.invoke.call(this._onCollisionEnter, collisionData, collider);
            }
        });
    }
    move(deltaTime) {
        if (deltaTime == undefined || deltaTime <= 0)
            return;
        this._previousX = this._entity.transform.x;
        this._previousY = this._entity.transform.y;
        this._entity.transform.x += deltaTime * this._velocityX;
        this._entity.transform.y += deltaTime * this._velocityY;
    }
}
class Line {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
}
