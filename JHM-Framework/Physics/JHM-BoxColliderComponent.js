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
        constructor() { }

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

        overlapsPoint(pointX, pointY) {
            return pointX > _bounds.left && pointX < _bounds.right
                && pointY > _bounds.bottom && pointY < _bounds.top;
        }
    }
    return new boxColliderComponent();
    /*
    TODO: Good to have but should be moved to a separate class.
    this.Draw = function () {
        var context = this.GetEntity().GetWindow().GetContext();
        context.beginPath();
        var XA = this.GetEntity().Coordinates().x + offsetX;
        // console.log(XA);
        var XB = XA + width;
        var YA = this.GetEntity().Coordinates().y + offsetY;
        var YB = YA + height;
        // console.log(XA +" " + YA);
        // console.log(XB + " " + YB)
        context.moveTo(XA, YA);
        context.lineTo(XB, YA);
        context.lineTo(XB, YB);
        context.lineTo(XA, YB);
        context.lineTo(XA, YA);
        context.stroke();
    }
    */
}