
const SpriteComponent = function (window, entity, spriteId = "", layer = 0) {
    let _window = window;
    let _entity = entity;
    let _layer = layer;

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

    class spriteComponent {
        constructor() {
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
            // context.rotate(-originRotation);
            context.translate(-translationX, -translationY);
        }
    }
    return new spriteComponent();
    // Set image offset from entity's position.
    /*
    this.SetOffset = function (newOffsetX, newOffsetY) {
        // Check types.
        CheckTypeForNumber(newOffsetX);
        CheckTypeForNumber(newOffsetY);
        // Set new offset.
        offsetX = newOffsetX;
        offsetY = newOffsetY;
    }
    this.GetOffset = function () {
        let returnValue =
        {
            x: offsetX,
            y: offsetY
        }
        return returnValue;
    }
    */

    // Scale image based on original image size.
    /*
    this.ScaleSizeByPercentage = function (scaleXPercentage, scaleYPercentage) {
        // Check types.
        try {
            scaleXPercentage = CheckTypeForNumber(scaleXPercentage);
            scaleXPercentage = CheckTypeForNumber(scaleYPercentage);
        }
        catch (err) {
            console.log("Error when scaling: " + err);
            return;
        }
        // Scale image.
        imageWidth = image.naturalWidth * scaleXPercentage * 0.01 / animationColumns;
        imageHeight = image.naturalHeight * scaleYPercentage * 0.01 / animationRows;

        // Scale offset
    }
    this.ScaleSizeToPixels = function (desiredPixelWidth, desiredPixelHeight) {
        // Check types.
        try {
            desiredPixelWidth = CheckTypeForNumber(desiredPixelWidth);
            desiredPixelHeight = CheckTypeForNumber(desiredPixelHeight);
        }
        catch (err) {
            console.log("Error when scaling: " + err);
            return;
        }
        // Scale image.
        imageWidth = desiredPixelWidth;
        imageHeight = desiredPixelHeight;
    }
    */
    /*
     this.SetAnimationProperties = function (frames, animationTime,
         imageSourceWidth, imageSourceHeight, columns, rows) {
         if (animationTime <= 0)
             animationTime = 1;
         spriteSheetFrames = frames;
         spriteAnimationSpeed = animationTime;
         cropWidth = imageSourceWidth;
         cropHeight = imageSourceHeight;
         spriteSheetColums = columns;
         spriteSheetRows = rows;
         currentAnimationFrame = 0;
     }
     this.StartAnimation = function () {
         animating = true;
     }
     this.StopAnimation = function () {
         animating = false;
     }
     */
}

// Private variables.
/*
var image;
var alpha = 1;
var imageWidth;
var imageHeight;

// Offset
var offsetX = 0;
var offsetY = 0;
var offsetRange;

// Image cropping
var cropOffsetX = 0;
var cropOffsetY = 0;
var cropWidth = 0;
var cropHeight = 0;

// Sprite sheet options
var spriteSheetFrames = 1;
var spriteSheetRows = 1;
var spriteSheetColums = 1;
var spriteAnimationSpeed = 1;
var currentAnimationFrame = 0;
var lastAnimationFrame = 0;
var animating = false;
*/
/*
var ResetAnimation = function () {
    currentAnimationFrame = 0;
    lastAnimationFrame = 0;
    cropOffsetX = 0;
    cropOffsetY = 0;
}
var count = 0;
var NextAnimationFrame = function () {
    // TODO: Rows & colums support.
    currentAnimationFrame += 1.0 / spriteAnimationSpeed;
    if (currentAnimationFrame > spriteSheetFrames) {
        ResetAnimation();
        return;
    }

    if (currentAnimationFrame - lastAnimationFrame >= 1.0) {
        var countFrame = Math.floor(currentAnimationFrame);
        var currentRow = Math.floor(countFrame / spriteSheetColums);

        cropOffsetY = cropHeight * (currentRow);
        cropOffsetX = cropWidth * (countFrame - currentRow * spriteSheetColums);
        lastAnimationFrame += Math.floor(
            currentAnimationFrame - lastAnimationFrame);
    }

}
*/