class PointRigidBody implements IRigidbody, IPhysicsActor, IComponent, IDestroyable {
    public dragEnabled = true;

    private _velocity = { x: 0, y: 0 };
    // private _velocityX: number = 0;
    // private _velocityY: number = 0;
    private _previousX: number;
    private _previousY: number;
    private _transform: ITransform;
    private _drag: IDragProfile;
    private readonly _onDestroy: Action = new Action();
    private readonly _loopAction: Action;
    private _updateActionId: number;
    // private _deltaTime: number;
    private readonly _onCollisionEnter: Action = new Action();

    private readonly _onCollisionExit: Action = new Action();
    private readonly _onCollisionStay: Action = new Action();
    /*
    // TODO: Implement collision stay & triggers
    private readonly _activeCollisionData: {
        collider: ICollider,
        updateCount: number,
        lastUpdateCount: number
    }[] = [];
    */
    public set velocity(value: { x: number, y: number }) { this._velocity = value; }
    public get velocity() { return this._velocity; }
    public get onCollisionEnter(): Action { return this._onCollisionEnter; }
    public get onCollisionExit(): Action { return this._onCollisionExit; }
    public get onCollisionStay(): Action { return this._onCollisionStay; }
    public get onDestroy() { return this._onDestroy; }
    public get entity() { return this._transform; }

    constructor(transform: ITransform) {
        this._transform = transform;
        this._previousX = transform.x;
        this._previousY = transform.y;
        this._drag = new PercentageDrag(5);
    }

    public update(deltaTime: number): void {
        // this._deltaTime = deltaTime;
        if (this.dragEnabled) {
            this.applyDrag(deltaTime);
        }
        this.move(deltaTime);
    }

    public destroy(): void {
        this._loopAction.remove(this._updateActionId);
        this._onDestroy.invoke();
    }

    public checkCollision(colliders: ICollider[]): void {
        colliders.forEach(collider => {
            if (collider.overlapsPoint(this._transform.x, this._transform.y)) {
                let x0 = this._previousX;
                let y0 = this._previousY;
                let x1 = this._transform.x;
                let y1 = this._transform.y;
                let dX = this._transform.x - this._previousX;
                let dY = this._transform.y - this._previousY;
                let lean = dY / dX;
                if (dX == 0) lean = 100000;
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

    public setDragProfile(drag:IDragProfile) {
        if (drag == null) return;
        this._drag = drag;
    }

    private move(deltaTime: number): void {
        if (deltaTime == undefined || deltaTime <= 0) return;
        this._previousX = this._transform.x;
        this._previousY = this._transform.y;
        this._transform.x += deltaTime * this._velocity.x;
        this._transform.y += deltaTime * this._velocity.y;
    }

    private applyDrag(deltaTime: number): void {
        let drag = this._drag.getDrag(this._velocity.x, this._velocity.y);
        this._velocity.x -= drag.dragX * deltaTime;
        this._velocity.y -= drag.dragY * deltaTime;
    }
}

class Line {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

}