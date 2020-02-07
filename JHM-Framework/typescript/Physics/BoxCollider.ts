class BoxCollider implements ICollider, IComponent, IDestroyable {
    private _entity: Entity;
    private _width: number;
    private _height: number;
    private _offsetX: number;
    private _offsetY: number;
    private _onDestroy: Action;

    get left(): number { return this._entity.transform.x + this._offsetX; }
    get right(): number { return this.left + this._width; }
    get top(): number { return this._entity.transform.y + this._offsetY; }
    get bottom(): number { return this.top + this._height; }
    get offset(): { x: number, y: number } {
        return {
            x: this._offsetX,
            y: this._offsetY
        }
    }
    get onDestroy(): Action { return this._onDestroy; }
    get entity(): Entity { return this._entity }

    constructor(entity: Entity, width: number, height: number,
        offsetX: number = 0, offsetY: number = 0) {
        this._entity = entity;
        this._width = width;
        this._height = height;
        this._offsetX = offsetX;
        this._offsetY = offsetY;

        this._onDestroy = new Action();
    }
    destroy(): void {
        this._onDestroy.invoke();
    }

    overlapsPoint(pointX: number, pointY: number): boolean {
        return pointX > this.left && pointX < this.right
            && pointY < this.bottom && pointY > this.top;
    }
    getCollisionPointWithRay(x0: number, y0: number, lean: number): { x: number, y: number } {
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
            } else {
                intersectPoint = intersectHorizontal;
            }
        }
        return intersectPoint;
    }
    private get corners(): { x: number, y: number }[] {
        return [
            { x: this.left, y: this.top },
            { x: this.right, y: this.top },
            { x: this.right, y: this.bottom },
            { x: this.left, y: this.bottom }
        ]
    }

    private getNearestCorner(x: number, y: number): { x: number, y: number } {
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