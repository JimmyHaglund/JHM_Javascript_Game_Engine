class Rigidbody {
    constructor(entity) {
        this.dragEnabled = true;
        this._velocity = { x: 0, y: 0 };
        this._onDestroy = new Action();
        this._onCollisionEnter = new Action();
        this._onCollisionExit = new Action();
        this._onCollisionStay = new Action();
        this._entity = entity;
        this._previousX = entity.x;
        this._previousY = entity.y;
        this._drag = new PercentageDrag(5);
    }
    set velocity(value) { this._velocity = value; }
    get velocity() { return this._velocity; }
    get onCollisionEnter() { return this._onCollisionEnter; }
    get onCollisionExit() { return this._onCollisionExit; }
    get onCollisionStay() { return this._onCollisionStay; }
    get onDestroy() { return this._onDestroy; }
    get entity() { return this._entity; }
    update(deltaTime) {
        if (this.dragEnabled) {
            this.applyDrag(deltaTime);
        }
        this.move(deltaTime);
    }
    destroy() {
        this._loopAction.remove(this._updateActionId);
        this._onDestroy.invoke();
    }
    checkCollision(colliders) {
        if (this._collider == null)
            return;
        colliders.forEach(collider => {
            if (collider == this._collider)
                return;
            var nearestPoint = this._collider.getNearestBoundingPoint(collider.centre.x, collider.centre.y);
            if (collider.overlapsPoint(nearestPoint.x, nearestPoint.y)) {
                let x0 = this._previousX;
                let y0 = this._previousY;
                let x1 = this._entity.x;
                let y1 = this._entity.y;
                let dX = this._entity.x - this._previousX;
                let dY = this._entity.y - this._previousY;
                let lean = dY / dX;
                if (dX == 0)
                    lean = 100000;
                let collisionData = collider.getFirstCollisionPointWithRay(x0, y0, dX, dY);
                let deltaColX = collisionData.x - x1;
                let deltaColY = collisionData.y - y1;
                this._velocity.x -= collisionData.normalX * this._velocity.x * -Math.sign(dX);
                this._velocity.y -= collisionData.normalY * this._velocity.y * -Math.sign(dY);
                this._entity.x -= collisionData.normalX * deltaColX * -Math.sign(deltaColX);
                this._entity.y -= collisionData.normalY * deltaColY * -Math.sign(deltaColY);
                this._onCollisionEnter.invoke.call(this._onCollisionEnter, collisionData, collider);
            }
        });
    }
    setDragProfile(drag) {
        if (drag == null)
            return;
        this._drag = drag;
    }
    move(deltaTime) {
        if (deltaTime == undefined || deltaTime <= 0)
            return;
        this._previousX = this._entity.x;
        this._previousY = this._entity.y;
        this._entity.x += deltaTime * this._velocity.x;
        this._entity.y += deltaTime * this._velocity.y;
    }
    applyDrag(deltaTime) {
        let drag = this._drag.getDrag(this._velocity.x, this._velocity.y);
        this._velocity.x -= drag.dragX * deltaTime;
        this._velocity.y -= drag.dragY * deltaTime;
    }
}
