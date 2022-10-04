declare class BoxCollider implements ICollider, IDestroyable, IComponent {
    private _entity;
    private _width;
    private _height;
    private _offsetX;
    private _offsetY;
    private _onDestroy;
    get left(): number;
    get right(): number;
    get top(): number;
    get bottom(): number;
    get offset(): {
        x: number;
        y: number;
    };
    get onDestroy(): Action;
    get entity(): Entity;
    get centre(): {
        x: number;
        y: number;
    };
    constructor(entity: Entity, width: number, height: number, offsetX?: number, offsetY?: number);
    worldCentre: {
        x: number;
        y: number;
    };
    boundingBox: {
        left: number;
        right: number;
        top: number;
        bottom: number;
    };
    boundingRadius: number;
    getNearestPoint(pointX: number, pointY: number): {
        x: number;
        y: number;
    };
    getNearestBoundingPoint(pointX: number, pointY: number): {
        x: number;
        y: number;
    };
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
    getShadowOnAxis(axisDirectionX: number, axisDirectionY: number): {
        minScalar: number;
        maxScalar: number;
    };
    getCollision(other: ICollider, checkOther: boolean): {
        x: number;
        y: number;
        normalX: number;
        normalY: number;
    };
    destroy(): void;
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
    private get corners();
}
