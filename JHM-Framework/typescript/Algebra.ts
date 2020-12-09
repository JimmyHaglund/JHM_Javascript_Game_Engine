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

    angleFromToCounterClockwise(x1:number, y1:number, x2:number, y2:number): number {
        let right = vector.right;
        let pi = Math.PI;
        let getRotation = function(x:number, y:number) {
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
    }
}