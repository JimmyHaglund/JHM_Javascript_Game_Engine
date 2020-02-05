
class SpriteComponent {
    private _transform: Transform;

let _alpha = 1;
let _spriteId = "";
let _spriteImage = null;
let _iRenderable = {
};
let _size = {
    width: 0,
    height: 0
};
let _crop = {
    width: 0,
    height: 0,
    offsetX: 0,
    offsetY: 0
};
let _offsetX = 0;
let _offsetY = 0;
let _onDestroy = new Action();

constructor(window, entity, spriteId = "", layer = 0) {
    this.spriteId = spriteId;
    if (_spriteImage != null) {
        _size.width = _spriteImage.naturalWidth;
        _size.height = _spriteImage.naturalHeight;
        _crop.width = _size.width;
        _crop.height = _size.height;
    }
    _crop.offsetX = 0;
    _crop.offsetY = 0;
}
set alpha(value) {
    alpha = value;
}
get alpha() { return _alpha; }
set spriteId(value) {
    if (_spriteId == value) return;
    _spriteId = value;
    _spriteImage = document.getElementById(_spriteId);
    if (_spriteImage == null) return;
}
setOffset(x, y){
    _offsetX = x;
    _offsetY = y;
}
get spriteId() { return _spriteId; }
get layer() { return _layer; }
get onDestroy() { return _onDestroy; }
get size() { return _size; }
destroy() {
    _onDestroy.invoke();
}
// Render image.
render(context, originRotation = 0) {
    if (_spriteImage == null) return;
    let contextAlpha = context.globalAlpha;
    let worldX = _entity.transform.worldX + _offsetX;
    let worldY = _entity.transform.worldY - _offsetY;
    let translationX =
        worldX * Math.cos(originRotation) -
        worldY * Math.sin(originRotation);
    let translationY =
        worldX * Math.sin(originRotation) +
        worldY * Math.cos(originRotation);
    // Set context settings
    context.translate(translationX, translationY);
    // context.rotate(originRotation);
    context.globalAlpha = _alpha;
    // console.log(entity.transform.worldY);
    // Render image to canvas.
    context.drawImage(
        _spriteImage, // image
        _crop.offsetX, // left crop rectangle
        _crop.offsetY, // top crop rectangle
        _crop.width, // crop rectangle width
        _crop.height, // crop rectangle height
        -_size.width / 2, // x coordinate relative to context position
        -_size.height / 2, // y coordinate relative to context position
        _size.width, // width of drawn image
        _size.height // height of drawn image
    );

    // Restore context to original settings
    context.globalAlpha = contextAlpha;
    context.translate(-translationX, -translationY);
}
return new spriteComponent();
}