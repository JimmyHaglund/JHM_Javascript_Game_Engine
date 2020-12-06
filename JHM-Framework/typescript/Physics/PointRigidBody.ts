class PointRigidBody implements IRigidbody, IPhysicsActor, IComponent, IDestroyable {
    private _velocity = { x: 0, y: 0 };
    // private _velocityX: number = 0;
    // private _velocityY: number = 0;
    private _previousX: number;
    private _previousY: number;
    private _entity: Entity;
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
    public set Velocity(value: { x: number, y: number }) { this._velocity = value; }
    public get Velocity() { return this._velocity; }
    public get OnCollisionEnter(): Action { return this._onCollisionEnter; }
    public get OnCollisionExit(): Action { return this._onCollisionExit; }
    public get OnCollisionStay(): Action { return this._onCollisionStay; }
    public get onDestroy() { return this._onDestroy; }
    public get entity() { return this._entity; }

    constructor(entity: Entity) {
        this._entity = entity;
        this._previousX = entity.transform.x;
        this._previousY = entity.transform.y;
    }

    public Update(deltaTime: number): void {
        // this._deltaTime = deltaTime;
        this.move(deltaTime);
    }

    public Destroy(): void {
        this._loopAction.remove(this._updateActionId);
        this._onDestroy.invoke();
    }

    public CheckCollision(colliders: ICollider[]): void {
        colliders.forEach(collider => {
            if (collider.overlapsPoint(this._entity.transform.x, this._entity.transform.y)) {
                let x0 = this._previousX;
                let y0 = this._previousY;
                let x1 = this._entity.transform.x;
                let y1 = this._entity.transform.y;
                let dX = this._entity.transform.x - this._previousX;
                let dY = this._entity.transform.y - this._previousY;
                let lean = dY / dX;
                if (dX == 0) lean = 100000;
                let collisionData = collider.getCollisionPointWithRay(x0, y0, dX, dY);
                let deltaColX = collisionData.x - x1;
                let deltaColY = collisionData.y - y1;
                this._velocity.x -= collisionData.normalX * this._velocity.x * -Math.sign(dX);
                this._velocity.y -= collisionData.normalY * this._velocity.y * -Math.sign(dY);
                this._entity.transform.x -= collisionData.normalX * deltaColX * -Math.sign(deltaColX);
                this._entity.transform.y -= collisionData.normalY * deltaColY * -Math.sign(deltaColY);
                this._onCollisionEnter.invoke.call(this._onCollisionEnter, collisionData, collider);
            }
        });
    }
    private move(deltaTime: number): void {
        if (deltaTime == undefined || deltaTime <= 0) return;
        this._previousX = this._entity.transform.x;
        this._previousY = this._entity.transform.y;
        this._entity.transform.x += deltaTime * this._velocity.x;
        this._entity.transform.y += deltaTime * this._velocity.y;
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