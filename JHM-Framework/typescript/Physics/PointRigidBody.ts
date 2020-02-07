class PointRigidBody implements IPhysicsActor, IComponent, IDestroyable {
    private _velocityX: number = 0;
    private _velocityY: number = 0;
    private _entity: Entity;
    private _onDestroy: Action = new Action();
    private _loopAction: Action;
    private _updateActionId: number;

    get velocityX(): number { return this._velocityX; }
    get velocityY(): number { return this._velocityY; }
    set velocityX(value: number) { this._velocityX = value; }
    set velocityY(value: number) { this._velocityY = value; }

    constructor(entity: Entity, loop: ILoop) {
        this._entity = entity;
        this._loopAction = loop.onUpdate;
        this._updateActionId = loop.onUpdate.add(this.update, this);
    }
    get onDestroy() { return this._onDestroy; }
    get entity() { return this._entity; }
    setVelocity(velocityX: number, velocityY: number) {
        this._velocityX = velocityX;
        this._velocityY = velocityY;
    }

    update(deltaTime: number) {
        if (deltaTime == undefined || deltaTime <= 0) return;
        this._entity.transform.x += deltaTime * this._velocityX;
        this._entity.transform.y += deltaTime * this._velocityY;
    }

    destroy() {
        this._loopAction.remove(this._updateActionId);
        this._onDestroy.invoke();
    }

    checkCollision(colliders: ICollider[]) {

    }
}