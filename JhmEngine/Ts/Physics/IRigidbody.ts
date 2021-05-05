interface IRigidbody extends IPhysicsActor {
    update(deltaTime: number): void;
    velocity: { x: number, y: number };
    dragEnabled: boolean;
}