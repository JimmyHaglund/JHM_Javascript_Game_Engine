class ShakerMaker {
    constructor(targetTransform, targetLoop) {
        this._targetTransform = targetTransform;
        this._targetLoop = targetLoop;
    }
    MakeShake(numberOfShakes = 1, shakeOffsetMin = 5, shakeOffsetMax = 15) {
        let shakeRange = { min: shakeOffsetMin, max: shakeOffsetMax };
        return new Shaker(this._targetTransform, this._targetLoop, numberOfShakes, shakeRange);
    }
}
class Shaker {
    constructor(targetTransform, loop, numberOfShakes, shakeOffset) {
        this._offsetX = 0;
        this._offsetY = 0;
        this._targetTransform = targetTransform;
        this._loopActionId = loop.onUpdate.add(this.update, this);
        this._remainingShakes = numberOfShakes;
        this._minOffset = shakeOffset.min;
        this._maxOffset = shakeOffset.max;
        this._loop = loop;
    }
    update() {
        this.resetTargetToNormal();
        let shakeMagnitude = this._minOffset + Math.random() * (this._maxOffset - this._minOffset);
        this.applyShake(shakeMagnitude);
        this.addShakeCount();
    }
    resetTargetToNormal() {
        this._targetTransform.x -= this._offsetX;
        this._targetTransform.y -= this._offsetY;
    }
    applyShake(magnitude) {
        this._targetTransform.x += magnitude;
        this._targetTransform.y += magnitude;
        this._offsetX = magnitude;
        this._offsetY = magnitude;
    }
    addShakeCount() {
        if (--this._remainingShakes < 0) {
            this.resetTargetToNormal();
            this._loop.onUpdate.remove(this._loopActionId);
        }
    }
}
