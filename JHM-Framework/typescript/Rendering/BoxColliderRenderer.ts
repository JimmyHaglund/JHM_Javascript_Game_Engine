class BoxColliderRenderer implements IRenderable, IDestroyable {
    private _onDestroy: Action = new Action();
    private _shouldFill: boolean;
    private _collider: BoxCollider;
    private _color: string;

    get onDestroy(): Action { return this._onDestroy; }

    set outlineOnly(value: boolean) { this._shouldFill = !value; }

    constructor(collider: BoxCollider, color: string = 'black', fill: boolean = false) {
        this._shouldFill = fill;
        this._collider = collider;
        this._color = color;
    }
    Render(context: CanvasRenderingContext2D): void {
        context.beginPath();
        let contextColor = context.fillStyle;
        let left = this._collider.left;
        let right = this._collider.right;
        let top = this._collider.top;
        let bottom = this._collider.bottom;
        context.fillStyle = this._color;
        context.strokeStyle = this._color;
        if (this._shouldFill) {
            this.renderFill(context, left, right, top, bottom);
        } else {
            this.renderOutline(context, left, right, top, bottom);
        }
        // context.fillStyle = contextColor;
        // context.strokeStyle = contextColor;
    }
    Destroy(): void {
        this._onDestroy.invoke();
    }
    renderOutline(context: CanvasRenderingContext2D, left: number, right: number, top: number, bottom: number) {
        context.moveTo(left, top);
        context.lineTo(right, top);
        context.lineTo(right, bottom);
        context.lineTo(left, bottom);
        context.closePath();
        context.stroke();
    }
    renderFill(context: CanvasRenderingContext2D, left: number, right: number, top: number, bottom: number) {
        let width = Math.abs(right - left);
        let height = Math.abs(bottom - top);
        context.fillRect(left, top, width, height);
    }
}