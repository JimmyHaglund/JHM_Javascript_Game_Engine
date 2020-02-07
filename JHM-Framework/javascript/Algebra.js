function getLineOverlapPoint(xA, yA, leanA, xB, yB, leanB) {
    if (leanA - leanB == 0)
        return null;
    let intersectPointX = (yB - xB * leanB - yA + xA * leanA) / (leanA - leanB);
    let intersectPointY = yA + leanA * (intersectPointX - xA);
    return {
        x: intersectPointX,
        y: intersectPointY
    };
}
function squareDistance(x0, y0, x1, y1) {
    return (x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0);
}
function insideRange(value, rangeA, rangeB) {
    if (rangeA > rangeB) {
        let swap = rangeA;
        rangeA = rangeB;
        rangeB = swap;
    }
    return (value >= rangeA && value <= rangeB);
}
