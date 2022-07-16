declare class PercentageDrag implements IDragProfile {
    private _dragPercentage;
    constructor(dragPercentage: number);
    getDrag(velocityX: number, velocityY: number): {
        dragX: number;
        dragY: number;
    };
}
