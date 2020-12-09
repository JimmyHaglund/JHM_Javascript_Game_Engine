interface IPhysicsActor extends IDestroyable {
    checkCollision(colliders: ICollider[]): void;
    onCollisionEnter: Action;
    onCollisionExit: Action;
    onCollisionStay: Action;
}