class PointRigidBody implements IPhysicsActor, IComponent, IDestroyable {
    private _velocityX: number = 0;
    private _velocityY: number = 0;
    private _previousX: number;
    private _previousY: number;
    private _entity: Entity;
    private readonly _onDestroy: Action = new Action();
    private readonly _loopAction: Action;
    private _updateActionId: number;
    private _deltaTime: number;
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
    get velocityX(): number { return this._velocityX; }
    get velocityY(): number { return this._velocityY; }
    set velocityX(value: number) { this._velocityX = value; }
    set velocityY(value: number) { this._velocityY = value; }
    get onCollisionEnter(): Action { return this._onCollisionEnter; }
    get onCollisionExit(): Action { return this._onCollisionExit; }
    get onCollisionStay(): Action { return this._onCollisionStay; }

    constructor(entity: Entity, loop: ILoop) {
        this._entity = entity;
        this._loopAction = loop.onUpdate;
        this._updateActionId = loop.onUpdate.add(this.update, this);
        this._previousX = entity.transform.x;
        this._previousY = entity.transform.y;
    }
    get onDestroy() { return this._onDestroy; }
    get entity() { return this._entity; }
    setVelocity(velocityX: number, velocityY: number) {
        this._velocityX = velocityX;
        this._velocityY = velocityY;
    }

    update(deltaTime: number) {
        this._deltaTime = deltaTime;
    }

    destroy() {
        this._loopAction.remove(this._updateActionId);
        this._onDestroy.invoke();
    }

    checkCollision(colliders: ICollider[]): void {
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
                if (dX == 0) lean = 100000;
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
    private move(deltaTime: number): void {
        if (deltaTime == undefined || deltaTime <= 0) return;
        this._previousX = this._entity.transform.x;
        this._previousY = this._entity.transform.y;
        this._entity.transform.x += deltaTime * this._velocityX;
        this._entity.transform.y += deltaTime * this._velocityY;
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