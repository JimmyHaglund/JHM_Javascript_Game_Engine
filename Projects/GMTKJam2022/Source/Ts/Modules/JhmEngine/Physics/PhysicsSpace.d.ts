declare class PhysicsSpace {
    private _actors;
    private _collisionSpaces;
    get physicsActors(): IPhysicsActor[];
    constructor(loop: ILoop, collisions: CollisionSpace[]);
    update(deltaTime: number): void;
    addPhysicsActor(actor: IPhysicsActor): void;
    removePhysicsActor(actor: IPhysicsActor): void;
}
