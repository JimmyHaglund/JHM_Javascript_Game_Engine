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
    Destroy() {
        this._onDestroy.invoke();
    }
    overlapsPoint(pointX, pointY) {
        return pointX > this.left && pointX < this.right
            && pointY < this.bottom && pointY > this.top;
    }
    getCollisionPointWithRay(x0, y0, xDir, yDir) {
        let corner = this.getNearestCorner(x0, y0);
        let lean = yDir / xDir;
        if (xDir == 0)
            lean = Math.sign(yDir) * 100000;
        let intersectVertical = null;
        let intersectHorizontal = null;
        // Only check for collision if ray has a chance of hitting the box
        let pointingAtBox = (corner.x > x0 && xDir > 0 || corner.x < x0 && xDir < 0 || Algebra.InsideRange(x0, this.left, this.right))
            && (corner.y > y0 && yDir > 0 || corner.y < y0 && yDir < 0 || Algebra.InsideRange(y0, this.top, this.bottom));
        if (pointingAtBox) {
            intersectVertical = Algebra.GetLineOverlapPoint(corner.x, corner.y, 100000, x0, y0, lean);
            intersectHorizontal = Algebra.GetLineOverlapPoint(corner.x, corner.y, 0, x0, y0, lean);
        }
        let foundHorizontal = false;
        let foundVertical = false;
        let intersectPoint = null;
        if (intersectHorizontal != null
            && Algebra.InsideRange(intersectHorizontal.x, this.left, this.right)) {
            foundHorizontal = true;
            intersectPoint = intersectHorizontal;
            intersectHorizontal.normalX = 0;
            intersectHorizontal.normalY = 1;
            if (corner.y == this.top) {
                intersectHorizontal.normalY = -1;
            }
        }
        if (intersectVertical != null
            && Algebra.InsideRange(intersectVertical.y, this.top, this.bottom)) {
            foundVertical = true;
            intersectPoint = intersectVertical;
            intersectVertical.normalY = 0;
            intersectVertical.normalX = 1;
            if (corner.x == this.left) {
                intersectVertical.normalX = -1;
            }
        }
        if (foundHorizontal && foundVertical) {
            if (Algebra.SquareDistance(intersectVertical.x, intersectVertical.y, x0, y0) <
                Algebra.SquareDistance(intersectHorizontal.x, intersectHorizontal.y, x0, y0)) {
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
        let deltaBottom = Math.abs(this.bottom - y);
        return {
            x: deltaLeft < deltaRight ? this.left : this.right,
            y: deltaTop < deltaBottom ? this.top : this.bottom
        };
    }
}
