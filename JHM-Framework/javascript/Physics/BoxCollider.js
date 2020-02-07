class BoxCollider {
    constructor(entity, width, height, offsetX = 0, offsetY = 0) {
        this._entity = entity;
        this._width = width;
        this._height = height;
        this._offsetX = offsetX;
        this._offsetY = offsetY;
        this._onDestroy = new Action();
    }
    get left() { return this._entity.transform.x + this._offsetX; }
    get right() { return this.left + this._width; }
    get top() { return this._entity.transform.y + this._offsetY; }
    get bottom() { return this.top + this._height; }
    get offset() {
        return {
            x: this._offsetX,
            y: this._offsetY
        };
    }
    get onDestroy() { return this._onDestroy; }
    get entity() { return this._entity; }
    destroy() {
        this._onDestroy.invoke();
    }
    overlapsPoint(pointX, pointY) {
        return pointX > this.left && pointX < this.right
            && pointY < this.bottom && pointY > this.top;
    }
    getCollisionPointWithRay(x0, y0, lean) {
        // let corners = this.corners;
        let corner = this.getNearestCorner(x0, y0);
        let intersectVertical = getLineOverlapPoint(corner.x, corner.y, 100000, x0, y0, lean);
        let intersectHorizontal = getLineOverlapPoint(corner.x, corner.y, 0, x0, y0, lean);
        let foundHorizontal = false;
        let foundVertical = false;
        let intersectPoint = null;
        if (intersectVertical != null
            && insideRange(intersectVertical.y, this.top, this.bottom)) {
            foundVertical = true;
            intersectPoint = intersectVertical;
        }
        if (intersectHorizontal != null
            && insideRange(intersectHorizontal.x, this.left, this.right)) {
            foundHorizontal = true;
            intersectPoint = intersectHorizontal;
        }
        if (foundHorizontal && foundVertical) {
            console.log("Intersect: ", intersectPoint);
            if (squareDistance(intersectVertical.x, intersectVertical.y, x0, y0) <
                squareDistance(intersectHorizontal.x, intersectHorizontal.y, x0, y0)) {
                intersectPoint = intersectVertical;
            }
            else {
                intersectPoint = intersectHorizontal;
            }
        }
        return intersectPoint;
    }
    get corners() {
        return [
            { x: this.left, y: this.top },
            { x: this.right, y: this.top },
            { x: this.right, y: this.bottom },
            { x: this.left, y: this.bottom }
        ];
    }
    getNearestCorner(x, y) {
        let deltaLeft = Math.abs(this.left - x);
        let deltaRight = Math.abs(this.right - x);
        let deltaTop = Math.abs(this.top - y);
        let deltaBottom = Math.abs(this.bottom - x);
        return {
            x: deltaLeft < deltaRight ? this.left : this.right,
            y: deltaTop < deltaBottom ? this.top : this.bottom
        };
    }
}
