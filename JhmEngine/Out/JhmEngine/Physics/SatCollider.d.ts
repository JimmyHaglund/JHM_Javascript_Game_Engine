declare class SatCollider implements ICollider, IComponent, IDestroyable {
    private _entity;
    private _vertices;
    private _normals;
    private _onDestroy;
    private _boundingBox;
    get vertices(): {
        x: number;
        y: number;
    }[];
    get onDestroy(): Action;
    get entity(): Entity;
    get normals(): {
        x: number;
        y: number;
    }[];
    get boundingBox(): {
        left: number;
        right: number;
        top: number;
        bottom: number;
    };
    get boundingRadius(): number;
    get centre(): {
        x: number;
        y: number;
    };
    get worldCentre(): {
        x: number;
        y: number;
    };
    constructor(entity: Entity, offsetX: number, offsetY: number, vertices: {
        x: number;
        y: number;
    }[]);
    destroy(): void;
    getCollision(other: ICollider, checkOther?: boolean): {
        x: number;
        y: number;
        normalX: number;
        normalY: number;
    };
    private getOutlineVector;
    private getNormals;
    private getBoundingBox;
    getShadowOnAxis(axisX: number, axisY: number): {
        minScalar: number;
        maxScalar: number;
    };
    private max;
    private sqrMag;
    overlapsPoint(pointX: number, pointY: number): boolean;
    getNearestPoint(targetX: number, targetY: number): {
        x: number;
        y: number;
    };
    getNearestBoundingPoint(targetX: number, targetY: number): {
        x: number;
        y: number;
    };
    private isInVertRange;
    getFirstCollisionPointWithRay(x0: number, y0: number, xDir: number, yDir: number): {
        x: number;
        y: number;
        normalX: number;
        normalY: number;
    };
    getCollisionPointsWithRay(x0: number, y0: number, x1: number, y1: number): {
        x: number;
        y: number;
        normalX: number;
        normalY: number;
    }[];
    private pointIsOnLineSegment;
    getNearestCorner(x: number, y: number): {
        x: number;
        y: number;
    };
    private getVertexWorldPosition;
    private getVertexViewPosition;
}
