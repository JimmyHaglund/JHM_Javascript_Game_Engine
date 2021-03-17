class ShakerMaker {
    private _targetTransform: Transform;
    private _targetLoop: ILoop;

    constructor(targetTransform: Transform, targetLoop: ILoop) {
        this._targetTransform = targetTransform;
        this._targetLoop = targetLoop;
    }

    public MakeShake(
        numberOfShakes:number = 1, 
        shakeOffsetMin: number = 5, 
        shakeOffsetMax: number = 15): Shaker {
        let shakeRange =  {min: shakeOffsetMin, max: shakeOffsetMax};
        return new Shaker(this._targetTransform, this._targetLoop,
            numberOfShakes, shakeRange);
    }
}

class Shaker {
    private _targetTransform: Transform;
    private _remainingShakes: number;
    private _minOffset: number;
    private _maxOffset: number;
    private _offsetX: number = 0;
    private _offsetY: number = 0;
    private _loop:ILoop;
    private _loopActionId:number;
    
    constructor(targetTransform: Transform, loop: ILoop, numberOfShakes: number, shakeOffset: { min: number, max: number }) {
        this._targetTransform = targetTransform;
        this._loopActionId = loop.onUpdate.add(this.update, this);
        this._remainingShakes = numberOfShakes;
        this._minOffset = shakeOffset.min;
        this._maxOffset = shakeOffset.max;
        this._loop = loop;
    }

    private update(): void {
        this.resetTargetToNormal();
        let shakeMagnitude = this._minOffset + Math.random() * (this._maxOffset - this._minOffset);
        this.applyShake(shakeMagnitude);
        this.addShakeCount();
    }

    private resetTargetToNormal(): void {
        this._targetTransform.x -= this._offsetX;
        this._targetTransform.y -= this._offsetY;
    }

    private applyShake(magnitude: number): void {
        this._targetTransform.x += magnitude;
        this._targetTransform.y += magnitude;
        this._offsetX = magnitude;
        this._offsetY = magnitude;
    }

    private addShakeCount() {
        if (--this._remainingShakes < 0) {
            this.resetTargetToNormal();
            this._loop.onUpdate.remove(this._loopActionId);
        }
    }
}