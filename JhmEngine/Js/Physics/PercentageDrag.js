class PercentageDrag {
    constructor(dragPercentage) {
        this._dragPercentage = 0.15;
        this._dragPercentage = dragPercentage;
    }
    getDrag(velocityX, velocityY) {
        return {
            dragX: velocityX * this._dragPercentage,
            dragY: velocityY * this._dragPercentage
        };
    }
}
