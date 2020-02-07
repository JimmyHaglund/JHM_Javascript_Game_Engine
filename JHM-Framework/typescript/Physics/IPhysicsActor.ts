interface IPhysicsActor extends IDestroyable {
    checkCollision(colliders: ICollider[]): void;
}