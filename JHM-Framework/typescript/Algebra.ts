function getLineOverlapPoint(xA: number, yA: number, leanA: number,
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
}

function squareDistance(x0: number, y0: number, x1: number, y1: number): number{
    return (x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0);
}

function insideRange(value: number, rangeA: number, rangeB: number): boolean {
    let min = rangeA > rangeB ? rangeB : rangeA;
    let max = rangeA < rangeB ? rangeB: rangeA;
    return (value >= Math.floor(min) && value <= Math.ceil(max));
}