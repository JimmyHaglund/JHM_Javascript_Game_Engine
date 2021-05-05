declare class CollisionSpace {
    protected _colliders: ICollider[];
    get colliders(): ICollider[];
    addCollider(collider: ICollider): void;
    removeCollider(collider: any): void;
    getColliders(): ICollider[];
}
