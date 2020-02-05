interface ICollider extends IDestroyable {
    overlapsPoint(pointX: number, pointY: number): boolean;
}