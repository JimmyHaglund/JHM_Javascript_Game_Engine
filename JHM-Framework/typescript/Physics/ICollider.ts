interface ICollider extends IDestroyable {
    overlapsPoint(pointX: number, pointY: number): boolean;
    getCollisionPointWithRay(x0: number, y0: number, lean: number): { x: number, y: number, normalX: number, normalY: number };
}