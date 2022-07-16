interface IPhysicsSpace {
    update(deltaTime: number): void;
    addCollider(collider: ICollider): void;
    removeCollider(collider: ICollider): void;
    getColliders(): ICollider[];
    addPhysicsActor(actor: IPhysicsActor): void;
    removePhysicsActor(actor: IPhysicsActor): void;
    getPhysicsActors(): IPhysicsActor[];
}
