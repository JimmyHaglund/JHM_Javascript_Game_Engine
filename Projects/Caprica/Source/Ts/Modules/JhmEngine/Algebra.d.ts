declare let algebra: {
    getLineOverlapPoint: (xA: number, yA: number, leanA: number, xB: number, yB: number, leanB: number) => {
        x: number;
        y: number;
    };
    project: (targetX: number, targetY: number, projectOnX: number, projectOnY: number) => {
        x: number;
        y: number;
    };
    closestPointOnLine: (targetX: number, targetY: number, linePointAX: number, linePointAY: number, linePointBX: number, linePointBY: number) => {
        x: number;
        y: number;
    };
    squareDistance: (x0: number, y0: number, x1: number, y1: number) => number;
    insideRange: (value: number, rangeA: number, rangeB: number) => boolean;
    magnitude(x: number, y: number): number;
    normalize(x: number, y: number): {
        x: number;
        y: number;
    };
    dot(x1: number, y1: number, x2: number, y2: number): number;
    angleBetween(x1: number, y1: number, x2: number, y2: number): number;
    angleFromToCounterClockwise(x1: number, y1: number, x2: number, y2: number): number;
    rotate(x: number, y: number, angle: number): {
        x: number;
        y: number;
    };
};
declare class Line {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    constructor(x1: any, y1: any, x2: any, y2: any);
}
