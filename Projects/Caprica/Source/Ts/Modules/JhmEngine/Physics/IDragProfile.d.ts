interface IDragProfile {
    getDrag(velocityX: number, velocityY: number): {
        dragX: number;
        dragY: number;
    };
}
