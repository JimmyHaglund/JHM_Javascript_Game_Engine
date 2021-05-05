class Transform implements ITransform {
    private _x: number = 0;
    private _y: number = 0;
    private _parent: Transform = null;
    private _rotation: number = null;

    constructor(positionX = 0, positionY = 0, rotation = 0, parent = null) {
        this._x = positionX;
        this._y = positionY;
        this._rotation = rotation;
        this._parent = parent;
    }

    set x(value: number) { this._x = value; }
    get x(): number { return this._x; }

    set y(value: number) { this._y = value; }
    get y(): number { return this._y; }

    get position() { return { x: this.x, y: this.y }; }

    get worldX(): number { return this._parent == null ? this._x : this._parent.worldX + this._x; }
    set worldX(value: number) {
        this._x = this._parent == null ? value : value - this._parent.worldX;
    }
    get worldY(): number { return this._parent == null ? this._y : this._parent.worldY + this._y; }
    set worldY(value: number) {
        this._y = this._parent == null ? value : value - this._parent.worldY;
    }

    set parent(value: Transform) { this._parent = value }
    get parent(): Transform { return this._parent; }
    set rotation(value: number) { this._rotation = value; }
    get rotation(): number { return this._rotation; }
}