function getLineOverlapPoint(xA: number, yA: number, leanA: number,
    xB: number, yB: number, leanB: number): { x: number, y: number } {
    if (leanA - leanB == 0) return null;
    let intersectPointX = (yB - xB * leanB - yA + xA * leanA) / (leanA - leanB);
    let intersectPointY = yA + leanA * (intersectPointX - xA);

    return {
        x: intersectPointX,
        y: intersectPointY
    }
}

function squareDistance(x0, y0, x1, y1){
    return (x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0);
}

function insideRange(value: number, rangeA: number, rangeB: number): boolean {
    if (rangeA > rangeB) {
        let swap = rangeA;
        rangeA = rangeB;
        rangeB = swap;
    }
    return (value >= rangeA && value <= rangeB);
}