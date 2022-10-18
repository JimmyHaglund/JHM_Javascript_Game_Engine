declare class Entity implements IDestroyable, ITransform {
    private _transform;
    private _components;
    private _onDestroy;
    get onDestroy(): Action;
    get transform(): Transform;
    get components(): IComponent[];
    constructor(positionX?: number, positionY?: number);
    destroy(): void;
    addComponent(component: IComponent): void;
    removeComponent(component: IComponent): void;
    getComponent<T>(type: ClassId): T;
    get x(): number;
    set x(value: number);
    get y(): number;
    set y(value: number);
    get worldX(): number;
    set worldX(value: number);
    get worldY(): number;
    set worldY(value: number);
    get rotation(): number;
    set rotation(value: number);
    get parent(): Transform;
    set parent(value: Transform);
}
