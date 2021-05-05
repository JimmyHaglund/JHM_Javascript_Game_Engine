declare class MousePointer implements IPhysicsActor {
    private _mouseX;
    private _mouseY;
    private _mouseWasPressed;
    private _mouseWasReleased;
    private _buttonMap;
    private _onDestroy;
    get onDestroy(): Action;
    get onCollisionEnter(): Action;
    get onCollisionExit(): Action;
    get onCollisionStay(): Action;
    constructor(mouseInput: MouseInput, loop: ILoop, physicsSpace: PhysicsSpace);
    destroy(): void;
    addButton(button: BoxButton): void;
    checkCollision(colliders: ICollider[]): void;
    private: any;
}
