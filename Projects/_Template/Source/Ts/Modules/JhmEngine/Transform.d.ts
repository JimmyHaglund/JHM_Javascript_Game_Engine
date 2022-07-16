declare class Transform implements ITransform {
    private _x;
    private _y;
    private _parent;
    private _rotation;
    constructor(positionX?: number, positionY?: number, rotation?: number, parent?: any);
    set x(value: number);
    get x(): number;
    set y(value: number);
    get y(): number;
    get position(): {
        x: number;
        y: number;
    };
    get worldX(): number;
    set worldX(value: number);
    get worldY(): number;
    set worldY(value: number);
    set parent(value: Transform);
    get parent(): Transform;
    set rotation(value: number);
    get rotation(): number;
}
