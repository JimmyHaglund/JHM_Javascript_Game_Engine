const Transform = function (positionX = 0, positionY = 0, rotation = 0, parent = null) {
    let _x = positionX;
    let _y = positionY;
    let _parent = parent;
    let _worldX = _parent == null ? positionX : parent.worldX + positionX;
    let _worldY = _parent == null ? positionY : parent.worldY + positionY;
    let _rotation = rotation;

    class transform {
        set x(value) {
            _x = value;
            _worldX = _parent == null ? _x : _parent.worldX + _x;
        }
        get x() { return _x; }

        set y(value) {
            _y = value;
            _worldY = _parent == null ? _y : _parent.worldY + _y;
        }
        get y() { return _y; }

        set worldX(value) {
            _worldX = value;
            _x = _parent == null ? _worldX : value - _parent.worldX;
        }
        get worldY() { return _worldY; }
        get worldX() { return _worldX; }

        set worldY(value) {
            _worldY = value;
            _y = _parent == null ? _worldY : value - _parent.worldY;
        }
        set parent(value) { _parent = value }
        get parent() { return _parent; }
        set rotation(value) { _rotation = value; }
        get rotation() { return _rotation; }
    }
    return new transform();
}