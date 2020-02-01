const BoxColliderRendererComponent = function (collider, layer = 0) {
    let _collider = collider;
    let _onDestroy = new Action();
    let _layer = layer;
    class boxColliderRendererComponent {
        get layer() { return _layer; }
        render(context, rotation) {
            context.beginPath();
            let left = _collider.bounds.left;
            let right = _collider.bounds.right;
            let top = _collider.bounds.top;
            let bottom = _collider.bounds.bottom;
            context.moveTo(left, top);
            context.lineTo(right, top);
            context.lineTo(right, bottom);
            context.lineTo(left, bottom);
            context.lineTo(left, top);
            context.stroke();
        }
        destroy() {
            _onDestroy.invoke();
        }
        get onDestroy() { return _onDestroy; }
    }
    return new boxColliderRendererComponent();
}