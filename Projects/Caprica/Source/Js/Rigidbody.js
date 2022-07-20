class RigidBody {
    constructor(transform, collider) {
        this.dragEnabled = true;
        this._velocity = { x: 0, y: 0 };
        this._onDestroy = new Action();
        // private _deltaTime: number;
        this._onCollisionEnter = new Action();
        this._onCollisionExit = new Action();
        this._onCollisionStay = new Action();
        this._transform = transform;
        this._collider = collider;
        this._previousX = transform.x;
        this._previousY = transform.y;
        this._drag = new PercentageDrag(5);
    }
    /*
    // TODO: Implement collision stay & triggers
    private readonly _activeCollisionData: {
        collider: ICollider,
        updateCount: number,
        lastUpdateCount: number
    }[] = [];
    */
    set velocity(value) { this._velocity = value; }
    get velocity() { return this._velocity; }
    get onCollisionEnter() { return this._onCollisionEnter; }
    get onCollisionExit() { return this._onCollisionExit; }
    get onCollisionStay() { return this._onCollisionStay; }
    get onDestroy() { return this._onDestroy; }
    get entity() { return this._transform; }
    update(deltaTime) {
        // this._deltaTime = deltaTime;
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
        // console.log("Checking Collision");
        for (let n = 0; n < colliders.length; n++) {
            let collider = colliders[n];
            var collision = this._collider.getCollision(collider, true);
            if (collision == null)
                continue;
            if (isNaN(collision.x))
                continue;
            if (collision.normalX == 0 && collision.normalY == 0)
                continue;
            let dX = this._transform.x - this._previousX;
            let dY = this._transform.y - this._previousY;
            let normalizedNormal = algebra.normalize(collision.normalX, collision.normalY);
            this._velocity.x -= normalizedNormal.x * this._velocity.x * -Math.sign(dX);
            this._velocity.y -= normalizedNormal.y * this._velocity.y * -Math.sign(dY);
            this._transform.x += collision.normalX;
            this._transform.y += collision.normalY;
            this._onCollisionEnter.invoke.call(this._onCollisionEnter, collision, collider);
        }
    }
    setDragProfile(drag) {
        if (drag == null)
            return;
        this._drag = drag;
    }
    move(deltaTime) {
        if (deltaTime == undefined || deltaTime <= 0)
            return;
        this._previousX = this._transform.x;
        this._previousY = this._transform.y;
        this._transform.x += deltaTime * this._velocity.x;
        this._transform.y += deltaTime * this._velocity.y;
    }
    applyDrag(deltaTime) {
        let drag = this._drag.getDrag(this._velocity.x, this._velocity.y);
        this._velocity.x -= drag.dragX * deltaTime;
        this._velocity.y -= drag.dragY * deltaTime;
    }
}
