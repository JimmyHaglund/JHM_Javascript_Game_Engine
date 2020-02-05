class BoxCollider {
    constructor(entity, width, height, offsetX = 0, offsetY = 0) {
        this._entity = entity;
        this._width = width;
        this._height = height;
        this._offsetX = offsetX;
        this._offsetY = offsetY;
        this._onDestroy = new Action();
    }
    get left() {
        return this._entity.transform.x + this._offsetX;
    }
    get right() {
        return this.left + this._width;
    }
    get top() {
        return this._entity.transform.y + this._offsetY;
    }
    get bottom() {
        return this.top + this._height;
    }
    get offset() {
        return {
            x: this._offsetX,
            y: this._offsetY
        };
    }
    get onDestroy() {
        return this._onDestroy;
    }
    destroy() {
        this._onDestroy.invoke();
    }
    overlapsPoint(pointX, pointY) {
        return pointX > this.left && pointX < this.right
            && pointY < this.bottom && pointY > this.top;
    }
}
