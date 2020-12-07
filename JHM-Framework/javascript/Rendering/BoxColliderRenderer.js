class BoxColliderRenderer {
    constructor(collider, color = 'black', fill = false) {
        this._onDestroy = new Action();
        this._shouldFill = fill;
        this._collider = collider;
        this._color = color;
    }
    get onDestroy() { return this._onDestroy; }
    set outlineOnly(value) { this._shouldFill = !value; }
    Render(context) {
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
        }
        else {
            this.renderOutline(context, left, right, top, bottom);
        }
        // context.fillStyle = contextColor;
        // context.strokeStyle = contextColor;
    }
    Destroy() {
        this._onDestroy.invoke();
    }
    renderOutline(context, left, right, top, bottom) {
        context.moveTo(left, top);
        context.lineTo(right, top);
        context.lineTo(right, bottom);
        context.lineTo(left, bottom);
        context.closePath();
        context.stroke();
    }
    renderFill(context, left, right, top, bottom) {
        let width = Math.abs(right - left);
        let height = Math.abs(bottom - top);
        context.fillRect(left, top, width, height);
    }
}
