class PointRigidBody {
    constructor(transform) {
        this.dragEnabled = true;
        this._velocity = { x: 0, y: 0 };
        this._onDestroy = new Action();
        // private _deltaTime: number;
        this._onCollisionEnter = new Action();
        this._onCollisionExit = new Action();
        this._onCollisionStay = new Action();
        this._transform = transform;
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
    set Velocity(value) { this._velocity = value; }
    get Velocity() { return this._velocity; }
    get OnCollisionEnter() { return this._onCollisionEnter; }
    get OnCollisionExit() { return this._onCollisionExit; }
    get OnCollisionStay() { return this._onCollisionStay; }
    get onDestroy() { return this._onDestroy; }
    get entity() { return this._transform; }
    Update(deltaTime) {
        // this._deltaTime = deltaTime;
        if (this.dragEnabled) {
            this.ApplyDrag(deltaTime);
        }
        this.Move(deltaTime);
    }
    destroy() {
        this._loopAction.remove(this._updateActionId);
        this._onDestroy.invoke();
    }
    CheckCollision(colliders) {
        colliders.forEach(collider => {
            if (collider.overlapsPoint(this._transform.x, this._transform.y)) {
                let x0 = this._previousX;
                let y0 = this._previousY;
                let x1 = this._transform.x;
                let y1 = this._transform.y;
                let dX = this._transform.x - this._previousX;
                let dY = this._transform.y - this._previousY;
                let lean = dY / dX;
                if (dX == 0)
                    lean = 100000;
                let collisionData = collider.getCollisionPointWithRay(x0, y0, dX, dY);
                let deltaColX = collisionData.x - x1;
                let deltaColY = collisionData.y - y1;
                this._velocity.x -= collisionData.normalX * this._velocity.x * -Math.sign(dX);
                this._velocity.y -= collisionData.normalY * this._velocity.y * -Math.sign(dY);
                this._transform.x -= collisionData.normalX * deltaColX * -Math.sign(deltaColX);
                this._transform.y -= collisionData.normalY * deltaColY * -Math.sign(deltaColY);
                this._onCollisionEnter.invoke.call(this._onCollisionEnter, collisionData, collider);
            }
        });
    }
    SetDragProfile(drag) {
        if (drag == null)
            return;
        this._drag = drag;
    }
    Move(deltaTime) {
        if (deltaTime == undefined || deltaTime <= 0)
            return;
        this._previousX = this._transform.x;
        this._previousY = this._transform.y;
        this._transform.x += deltaTime * this._velocity.x;
        this._transform.y += deltaTime * this._velocity.y;
    }
    ApplyDrag(deltaTime) {
        let drag = this._drag.GetDrag(this._velocity.x, this._velocity.y);
        this._velocity.x -= drag.dragX * deltaTime;
        this._velocity.y -= drag.dragY * deltaTime;
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
