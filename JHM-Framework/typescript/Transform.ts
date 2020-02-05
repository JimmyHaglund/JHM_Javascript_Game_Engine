class Transform {
    private _x: number = 0;
    private _y: number = 0;
    private _parent: Transform = null;
    private _rotation: number = null;

    constructor(positionX = 0, positionY = 0, rotation = 0, parent = null){
        this._x = positionX;
        this._y = positionY;
        this._rotation = rotation;
        this._parent = parent;
    }

    set x(value) { this._x = value; }
    get x() { return this._x; }

    set y(value) { this._y = value; }
    get y() { return this._y; }

    get worldX() { return this._parent == null ? this._x : this._parent.worldX + this._x; }
    set worldX(value) {
        this._x = this._parent == null ? value : value - this._parent.worldX;
    }
    get worldY() { return this._parent == null ? this._y : this._parent.worldY + this._y; }
    set worldY(value) {
        this._y = this._parent == null ? value : value - this._parent.worldY;
    }

    set parent(value) { this._parent = value }
    get parent() { return this._parent; }
    set rotation(value) { this._rotation = value; }
    get rotation() { return this._rotation; }
}