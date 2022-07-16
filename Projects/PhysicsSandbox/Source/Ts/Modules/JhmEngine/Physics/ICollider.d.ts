interface ICollider extends IDestroyable {
    centre: {
        x: number;
        y: number;
    };
    overlapsPoint(pointX: number, pointY: number): boolean;
    getCollisionPointWithRay(x0: number, y0: number, xDir: number, yDir: number): {
        x: number;
        y: number;
        normalX: number;
        normalY: number;
    };
    getNearestCorner(x: number, y: number): {
        x: number;
        y: number;
    };
}
