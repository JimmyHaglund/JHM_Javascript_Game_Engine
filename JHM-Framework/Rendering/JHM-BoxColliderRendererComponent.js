const BoxColliderRendererComponent = function (collider, layer = 0, color = 'black', fill = false) {
    let _collider = collider;
    let _onDestroy = new Action();
    let _layer = layer;
    let _fill = fill;
    let _color = color;
    class boxColliderRendererComponent {
        get layer() { return _layer; }
        render(context, rotation) {
            context.beginPath();
            let baseColor = context.color;
            let left = _collider.bounds.left;
            let right = _collider.bounds.right;
            let top = _collider.bounds.top;
            let bottom = _collider.bounds.bottom;
            context.fillStyle = _color;
            context.strokeStyle = _color;
            if (_fill) {
                renderFill(context, left, bottom);
            } else {
                renderOutline(context, left, right, top, bottom);
            }
            context.fillStyle = baseColor;
            context.strokeStyle = baseColor;
        }
        destroy() {
            _onDestroy.invoke();
        }
        get onDestroy() { return _onDestroy; }
    }
    return new boxColliderRendererComponent();
    function renderOutline(context, left, right, top, bottom) {
        context.moveTo(left, top);
        context.lineTo(right, top);
        context.lineTo(right, bottom);
        context.lineTo(left, bottom);
        context.closePath();
        context.stroke();
    }
    function renderFill(context, left, bottom) {
        context.fillRect(left, bottom, _collider.width, _collider.height);
    }
}