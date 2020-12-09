interface IPhysicsSpace {
    Update(deltaTime: number): void;
    AddCollider(collider: ICollider): void;
    RemoveCollider(collider: ICollider): void;
    GetColliders(): ICollider[];
    AddPhysicsActor(actor: IPhysicsActor): void;
    RemovePhysicsActor(actor: IPhysicsActor): void;
    GetPhysicsActors(): IPhysicsActor[];
}