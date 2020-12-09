class PercentageDrag implements IDragProfile {
    private _dragPercentage:number = 0.15;

    constructor(dragPercentage: number) {
        this._dragPercentage = dragPercentage;
    }

    public GetDrag(velocityX:number, velocityY:number):{dragX:number, dragY:number} {
        return {
            dragX: velocityX * this._dragPercentage,
            dragY: velocityY * this._dragPercentage
        };
    }
}