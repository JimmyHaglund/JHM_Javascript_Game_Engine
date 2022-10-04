class Rigidbody implements IRigidbody, IPhysicsActor, IComponent, IDestroyable {
    public dragEnabled = true;

    private _velocity = { x: 0, y: 0 };
    private _previousX: number;
    private _previousY: number;
    private _entity: Entity;
    private _drag: IDragProfile;
    private readonly _onDestroy: Action = new Action();
    private readonly _loopAction: Action;
    private _updateActionId: number;
    private readonly _onCollisionEnter: Action = new Action();
    private readonly _onCollisionExit: Action = new Action();
    private readonly _onCollisionStay: Action = new Action();
    private readonly _collider: ICollider;

    public set velocity(value: { x: number, y: number }) { this._velocity = value; }
    public get velocity() { return this._velocity; }
    public get onCollisionEnter(): Action { return this._onCollisionEnter; }
    public get onCollisionExit(): Action { return this._onCollisionExit; }
    public get onCollisionStay(): Action { return this._onCollisionStay; }
    public get onDestroy() { return this._onDestroy; }
    public get entity() { return this._entity; }

    constructor(entity: Entity) {
        this._entity = entity;
        this._previousX = entity.x;
        this._previousY = entity.y;
        this._drag = new PercentageDrag(5);
    }

    public update(deltaTime: number): void {
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
        if (this._collider == null) return;
        colliders.forEach(collider => {
            if (collider == this._collider) return;
            var nearestPoint = this._collider.getNearestBoundingPoint(collider.centre.x, collider.centre.y);
            
            if (collider.overlapsPoint(nearestPoint.x, nearestPoint.y)) {
                let x0 = this._previousX;
                let y0 = this._previousY;
                let x1 = this._entity.x;
                let y1 = this._entity.y;
                let dX = this._entity.x - this._previousX;
                let dY = this._entity.y - this._previousY;
                let lean = dY / dX;
                if (dX == 0) lean = 100000;
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

    public setDragProfile(drag:IDragProfile) {
        if (drag == null) return;
        this._drag = drag;
    }

    private move(deltaTime: number): void {
        if (deltaTime == undefined || deltaTime <= 0) return;
        this._previousX = this._entity.x;
        this._previousY = this._entity.y;
        this._entity.x += deltaTime * this._velocity.x;
        this._entity.y += deltaTime * this._velocity.y;
    }

    private applyDrag(deltaTime: number): void {
        let drag = this._drag.getDrag(this._velocity.x, this._velocity.y);
        this._velocity.x -= drag.dragX * deltaTime;
        this._velocity.y -= drag.dragY * deltaTime;
    }
}