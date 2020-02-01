const Transform = function (positionX = 0, positionY = 0, rotation = 0, parent = null) {
    let _x = positionX;
    let _y = positionY;
    let _parent = parent;
    let _rotation = rotation;

    class transform {
        set x(value) { _x = value; }
        get x() { return _x; }

        set y(value) { _y = value; }
        get y() { return _y; }

        get worldX() { return _parent == null ? _x : _parent.worldX + _x; }
        set worldX(value) {
            _x = _parent == null ? value : value - _parent.worldX;
        }
        get worldY() { return _parent == null ? _y : _parent.worldY + _y; }
        set worldY(value) {
            _y = _parent == null ? value : value - _parent.worldY;
        }

        set parent(value) { _parent = value }
        get parent() { return _parent; }
        set rotation(value) { _rotation = value; }
        get rotation() { return _rotation; }
    }
    return new transform();
}