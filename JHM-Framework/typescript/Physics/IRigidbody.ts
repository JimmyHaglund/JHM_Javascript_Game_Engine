interface IRigidbody extends IPhysicsActor {
    Update(deltaTime: number): void;
    Velocity: { x: number, y: number };
}