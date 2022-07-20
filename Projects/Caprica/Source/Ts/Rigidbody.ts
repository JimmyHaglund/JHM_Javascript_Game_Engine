class RigidBody implements IRigidbody, IPhysicsActor, IComponent, IDestroyable {
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
    private _collider: ICollider;
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

    constructor(transform: ITransform, collider: ICollider) {
        this._transform = transform;
        this._collider = collider;
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
        // console.log("Checking Collision");
        for(let n = 0; n < colliders.length; n++) {
            let collider = colliders[n];
            var collision = this._collider.getCollision(collider, true);
            if (collision == null) continue;
            if (isNaN(collision.x)) continue;
            if (collision.normalX == 0 && collision.normalY == 0) continue;
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