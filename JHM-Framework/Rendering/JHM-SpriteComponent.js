
const SpriteComponent = function (window, entity, spriteId = "", layer = 0) {
    let _window = window;
    let _entity = entity;
    let _layer = layer;

    let _alpha = 1;
    let _spriteId = spriteId;
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
    let _onDestroy = new Action();

    class spriteComponent {
        constructor() {
            this.spriteId = _spriteId;
        }
        set alpha(value) {
            alpha = value;
        }
        set spriteId(value) {
            _spriteId = value;
            if (_spriteId == null) return;
            _spriteImage = document.getElementById(_spriteId);
            _size.width = image.naturalWidth;
            _size.height = image.naturalHeight;
            _crop.width = _size.width;
            _crop.height = _size.height;
            _crop.offsetX = 0;
            _crop.offsetY = 0;
        }
        get spriteId() { return _spriteId; }
        get layer() { return _layer; }
        get onDestroy() { console.log(_onDestroy); return _onDestroy;}
        get size() { return _size; }
        destroy() {
            _onDestroy.invoke();
        }
        // Render image.
        render(context, originX = 0, originY = 0, originRotation = 0) {
            // if (animating)
            //     NextAnimationFrame();
            if (_spriteImage == null) return;
            let contextAlpha = context.globalAlpha;
            let offsetX = _size.width / 2 + offsetX;
            let offsetY = _size.height / 2 + offsetY;
            let worldOriginToX = _entity.transform.worldX - originX;
            let worldOriginToY = _entity.transform.worldY - originY;
            let translationX =
                worldOriginToX * Math.cos(originRotation) -
                worldOriginToY * Math.sin(originRotation);
            let translationY =
                worldOriginToX * Math.sin(originRotation) +
                worldOriginToY * Math.cos(originRotation);

            // Set context settings
            context.translate(translationX, translationY);
            context.rotate(originRotation);
            context.globalAlpha = _alpha;

            // Render image to canvas.
            context.drawImage(image,
                _crop.offsetX,
                _crop.offsetY,
                _crop.width,
                _crop.height,
                -_size.width / 2,
                -_size.height / 2,
                _size.width,
                _size.height);

            // Restore context to original settings
            context.globalAlpha = contextAlpha;
            context.rotate(-originRotation);
            context.translate(-translationX,
                -translationY);
        }
    }

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