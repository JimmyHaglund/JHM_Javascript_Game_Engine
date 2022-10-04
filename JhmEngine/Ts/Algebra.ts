let algebra = {
    getLineOverlapPoint: function (xA: number, yA: number, leanA: number,
        xB: number, yB: number, leanB: number): { x: number, y: number } {
        if (leanA - leanB == 0) {
            return null;
        }
        let intersectPointX = (yB - xB * leanB - yA + xA * leanA) / (leanA - leanB);
        let intersectPointY = yA + leanA * (intersectPointX - xA);

        return {
            x: intersectPointX,
            y: intersectPointY
        }
    },
    project: function (targetX: number, targetY: number, projectOnX:number, projectOnY:number): {x: number, y: number} {
        let dot = targetX * projectOnX + targetY * projectOnY;
        let pLengthSquared = projectOnX * projectOnX + projectOnY * projectOnY;
        let length = dot / (pLengthSquared);
        return {
           x: projectOnX * length,
           y: projectOnY * length
        };
     },
    // Accepts a point and two points defining a line. Returns the point on the line that is closes to the provided point.
    closestPointOnLine :function(targetX: number, targetY: number, linePointAX: number, linePointAY: number, linePointBX: number, linePointBY: number): { x: number, y: number } {
    let relativePoint = {
       x: targetX - linePointAX,
       y: targetY - linePointAY
    };
    let relativeLine = { 
       x: linePointBX - linePointAX,
       y: linePointBY - linePointAY
    };
    let projection = (algebra.project(relativePoint.x, relativePoint.y, relativeLine.x, relativeLine.y));
 
    return {
       x: linePointAX + projection.x,
       y: linePointAY + projection.y
    };
 },
 
 

    squareDistance: function (x0: number, y0: number, x1: number, y1: number): number {
        return (x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0);
    },

    insideRange: function (value: number, rangeA: number, rangeB: number): boolean {
        let min = rangeA > rangeB ? rangeB : rangeA;
        let max = rangeA < rangeB ? rangeB : rangeA;
        return (value >= Math.floor(min) && value <= Math.ceil(max));
    },

    magnitude(x: number, y: number): number {
        if (x == 0 && y == 0) return 0;
        return Math.sqrt(x * x + y * y);
    },

    normalize(x: number, y: number): { x: number, y: number } {
        let magnitude = algebra.magnitude(x, y);
        return {
            x: x / magnitude,
            y: y / magnitude
        };
    },

    dot(x1: number, y1: number, x2: number, y2: number): number {
        return x1 * x2 + y1 * y2;
    },

    angleBetween(x1: number, y1: number, x2: number, y2: number): number {
        let magnitude1 = algebra.magnitude(x1, y1);
        let magnitude2 = algebra.magnitude(x2, y2);
        let dotProduct = algebra.dot(x1, y1, x2, y2);
        let cosineOfAngle = algebra.dot(x1, y1, x2, y2) / (magnitude1 * magnitude2);
        if (magnitude1 == 0 && magnitude2 == 0) return 0;
        return Math.acos(cosineOfAngle);
    },

    angleFromToCounterClockwise(x1: number, y1: number, x2: number, y2: number): number {
        let right = vector.right;
        let pi = Math.PI;
        let getRotation = function (x: number, y: number) {
            let angleFromRight = algebra.angleBetween(right.x, right.y, x, y);
            if (y < 0) return 2 * pi - angleFromRight;
            return angleFromRight;
        }
        let rotation1 = getRotation(x1, y1);
        let rotation2 = getRotation(x2, y2);
        let deltaRotation = rotation2 - rotation1;
        if (rotation2 < rotation1) {
            return 2 * pi - deltaRotation;
        }
        return deltaRotation;
    },

    rotate(x: number, y: number, angle: number): { x: number, y: number } {
        return {
            x: x * Math.cos(angle) - y * Math.sin(angle),
            y: x * Math.sin(angle) + y * Math.cos(angle)
        };
    }
}


class Line {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
}