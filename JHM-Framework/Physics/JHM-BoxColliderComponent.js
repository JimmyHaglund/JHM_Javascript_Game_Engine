const BoxColliderComponent = function (entity, width, height, offsetX = 0, offsetY = 0) {
    let _width = width;
    let _height = height;
    let _offsetX = offsetX;
    let _offsetY = offsetY;
    let _onDestroy = new Action();
    let _entity = entity;
    class Bounds {
        get left() {
            return _entity.transform.worldX + _offsetX;
        }
        get right() {
            return _entity.transform.worldX + _width + _offsetX;
        }
        get top() {
            return _entity.transform.worldY + _height + offsetY;
        }
        get bottom() {
            return _entity.transform.worldY + offsetY;
        }
    }
    let _bounds = new Bounds();
    class boxColliderComponent {
        constructor() {  }

        destroy() {
            _onDestroy.invoke();
        }
        get _onDestroy() { return _onDestroy; }

        get width() { return _width; }
        set width(value) { _width = value; }

        get height() { return _height; }
        set height(value) { _height = value; }
        
        get offsetX() { return _offsetX; }
        set offsetX(value) { _offsetX = value; }

        get offsetY() { return _offsetY; }
        set offsetY(value) { _offsetY = value; }

        get bounds() { return _bounds; }
        overlapsPoint(pointX, pointY) {
            return pointX > _bounds.left && pointX < _bounds.right
                && pointY > _bounds.bottom && pointY < _bounds.top;
        }
    }
    return new boxColliderComponent();
}