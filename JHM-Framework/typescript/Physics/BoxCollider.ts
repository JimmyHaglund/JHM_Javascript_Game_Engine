class BoxCollider implements ICollider, IDestroyable {
    private _entity: Entity;
    private _width: number;
    private _height: number;
    private _offsetX: number;
    private _offsetY: number;
    private _onDestroy: Action;
    
    get left(): number {
        return this._entity.transform.x + this._offsetX;
    }
    get right(): number {
        return this.left + this._width;
    }
    get top(): number {
        return this._entity.transform.y + this._offsetY;
    }
    get bottom(): number {
        return this.top + this._height;
    }

    get offset(): { x: number, y: number } {
        return {
            x: this._offsetX,
            y: this._offsetY
        }
    }

    get onDestroy() {
        return this._onDestroy;
    }

    constructor(entity: Entity, width: number, height: number,
        offsetX: number = 0, offsetY: number = 0) {
        this._entity = entity;
        this._width = width;
        this._height = height;
        this._offsetX = offsetX;
        this._offsetY = offsetY;

        this._onDestroy = new Action();
        this._entity.onDestroy.add(this.destroy, this);
    }
    destroy(): void {
        this._onDestroy.invoke();
    }

    overlapsPoint(pointX: number, pointY: number): boolean {
        return pointX > this.left && pointX < this.right
            && pointY > this.bottom && pointY < this.top;
    }
}