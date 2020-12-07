let Algebra = {
    GetLineOverlapPoint: function (xA, yA, leanA, xB, yB, leanB) {
        if (leanA - leanB == 0) {
            return null;
        }
        let intersectPointX = (yB - xB * leanB - yA + xA * leanA) / (leanA - leanB);
        let intersectPointY = yA + leanA * (intersectPointX - xA);
        return {
            x: intersectPointX,
            y: intersectPointY
        };
    },
    SquareDistance: function (x0, y0, x1, y1) {
        return (x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0);
    },
    InsideRange: function (value, rangeA, rangeB) {
        let min = rangeA > rangeB ? rangeB : rangeA;
        let max = rangeA < rangeB ? rangeB : rangeA;
        return (value >= Math.floor(min) && value <= Math.ceil(max));
    },
    Magnitude(x, y) {
        if (x == 0 && y == 0)
            return 0;
        return Math.sqrt(x * x + y * y);
    },
    Dot(x1, y1, x2, y2) {
        return x1 * x2 + y1 * y2;
    },
    AngleBetween(x1, y1, x2, y2) {
        let magnitude1 = Algebra.Magnitude(x1, y1);
        let magnitude2 = Algebra.Magnitude(x2, y2);
        let dotProduct = Algebra.Dot(x1, y1, x2, y2);
        let cosineOfAngle = Algebra.Dot(x1, y1, x2, y2) / (magnitude1 * magnitude2);
        if (magnitude1 == 0 && magnitude2 == 0)
            return 0;
        return Math.acos(cosineOfAngle);
    },
    AngleFromToCounterClockwise(x1, y1, x2, y2) {
        let right = Vector.Right;
        let pi = Math.PI;
        let getRotation = function (x, y) {
            let angleFromRight = Algebra.AngleBetween(right.x, right.y, x, y);
            if (y < 0)
                return 2 * pi - angleFromRight;
            return angleFromRight;
        };
        let rotation1 = getRotation(x1, y1);
        let rotation2 = getRotation(x2, y2);
        let deltaRotation = rotation2 - rotation1;
        if (rotation2 < rotation1) {
            return 2 * pi - deltaRotation;
        }
        return deltaRotation;
    }
};
