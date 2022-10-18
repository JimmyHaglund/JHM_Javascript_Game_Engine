declare class Rigidbody implements IRigidbody, IPhysicsActor, IComponent, IDestroyable {
    dragEnabled: boolean;
    private _velocity;
    private _previousX;
    private _previousY;
    private _entity;
    private _drag;
    private readonly _onDestroy;
    private readonly _loopAction;
    private _updateActionId;
    private readonly _onCollisionEnter;
    private readonly _onCollisionExit;
    private readonly _onCollisionStay;
    private readonly _collider;
    set velocity(value: {
        x: number;
        y: number;
    });
    get velocity(): {
        x: number;
        y: number;
    };
    get onCollisionEnter(): Action;
    get onCollisionExit(): Action;
    get onCollisionStay(): Action;
    get onDestroy(): Action;
    get entity(): Entity;
    constructor(entity: Entity);
    update(deltaTime: number): void;
    destroy(): void;
    checkCollision(colliders: ICollider[]): void;
    setDragProfile(drag: IDragProfile): void;
    private move;
    private applyDrag;
}
