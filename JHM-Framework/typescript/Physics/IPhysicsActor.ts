interface IPhysicsActor extends IDestroyable {
    CheckCollision(colliders: ICollider[]): void;
    OnCollisionEnter: Action;
    OnCollisionExit: Action;
    OnCollisionStay: Action;
}