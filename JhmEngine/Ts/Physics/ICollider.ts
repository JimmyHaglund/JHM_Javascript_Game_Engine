interface ICollider extends IComponent, IDestroyable {
    centre: { x: number, y: number };
    worldCentre: { x: number, y: number };
    boundingBox: { left: number, right: number, top: number, bottom: number};
    boundingRadius: number;

    overlapsPoint(pointX: number, pointY: number): boolean;
    getNearestPoint(pointX: number, pointY: number): {x: number, y: number};
    getNearestBoundingPoint(pointX: number, pointY: number): {x: number, y: number};
    
    getFirstCollisionPointWithRay(x0: number, y0: number, xDir: number, yDir: number): {
        x: number;
        y: number;
        normalX: number;
        normalY: number;
    };
    getCollisionPointsWithRay(x0: number, y0: number, lean: number, length: number): {
        x: number;
        y: number;
        normalX: number;
        normalY: number;
    }[];
    getShadowOnAxis(axisDirectionX: number, axisDirectionY:number): { minScalar: number, maxScalar: number };
    getCollision(other: ICollider, checkOther: boolean): { x: number, y: number, normalX: number, normalY: number};
}

