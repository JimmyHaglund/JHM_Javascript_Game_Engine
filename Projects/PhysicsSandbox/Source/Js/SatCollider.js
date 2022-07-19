// TODO: Implement normals calculation
// TODO: Implement collision
class SatCollider {
    constructor(entity, offsetX = 0, offsetY = 0, vertices) {
        this._entity = entity;
        this._vertices = vertices;
        this._normals = this.getNormals(vertices);
        this._boundingBox = this.getBoundingBox(vertices);
        this._onDestroy = new Action();
    }
    get vertices() {
        return this._vertices;
    }
    get onDestroy() { return this._onDestroy; }
    get entity() { return this._entity; }
    get normals() {
        return this._normals;
    }
    get boundingBox() {
        return this._boundingBox;
    }
    get boundingRadius() {
        let boundingBox = this._boundingBox;
        return Math.max(boundingBox.left, boundingBox.right, boundingBox.top, boundingBox.bottom);
    }
    get centre() {
        const bounds = this.boundingBox;
        const x = bounds.left + (bounds.right - bounds.left) * 0.5;
        const y = bounds.top + (bounds.bottom - bounds.top) * 0.5;
        return { x, y };
    }
    get worldCentre() {
        const localCentre = this.centre;
        return {
            x: localCentre.x + this.entity.worldX,
            y: localCentre.y + this.entity.worldY
        };
    }
    destroy() {
        this._onDestroy.invoke();
    }
    getCollision(other, checkOther = true) {
        let vertices = this._vertices;
        if (vertices.length < 2)
            return;
        let collidingIndex = -1;
        let collidingDistance = Number.MAX_SAFE_INTEGER;
        for (let n = 0; n < vertices.length; n++) {
            let axis = this._normals[n];
            let otherCentre = other.worldCentre;
            let myCentre = this.worldCentre;
            let distX = otherCentre.x - myCentre.x;
            let distY = otherCentre.y - myCentre.y;
            let angleDot = algebra.dot(distX, distY, axis.x, axis.y);
            if (angleDot < 0)
                continue;
            let myProjection = this.getShadowOnAxis(axis.x, axis.y);
            let theirProjection = other.getShadowOnAxis(axis.x, axis.y);
            if (myProjection.minScalar > theirProjection.maxScalar
                || myProjection.maxScalar < theirProjection.minScalar) {
                // No shadow overlap -> no collision, quit
                return null;
            }
            // Collision found - compare distance to determine if that's the closest to push out
            let pen0 = Math.max(myProjection.minScalar, theirProjection.minScalar);
            let pen1 = Math.min(myProjection.maxScalar, theirProjection.maxScalar);
            let penetration = Math.abs(pen1 - pen0);
            if (penetration > collidingDistance && n > 0)
                continue;
            if (penetration == collidingDistance) {
                // projecting two opposite, symmetrical sides would yield the same shadow.
                // Use the vertex with min distance to the other
            }
            collidingDistance = penetration;
            collidingIndex = n;
        }
        // Do same thing for other polygon's vertices
        if (checkOther) {
            let otherCollision = other.getCollision(this, false);
            if (otherCollision == null)
                return null;
            if (algebra.squareDistance(0, 0, otherCollision.normalX, otherCollision.normalY) < collidingDistance) {
                otherCollision.normalX *= -1;
                otherCollision.normalY *= -1;
                return otherCollision;
            }
        }
        let startVertex = vertices[collidingIndex];
        let endVertex = vertices[0];
        if (collidingIndex < vertices.length - 1)
            endVertex = vertices[collidingIndex + 1];
        let startPoint = {
            x: startVertex.x + 0.5 * (endVertex.x - startVertex.x),
            y: startVertex.y + 0.5 * (endVertex.y - startVertex.y)
        };
        let directionVector = this._normals[collidingIndex];
        let collisionX = this._entity.worldX + startPoint.x - directionVector.x * collidingDistance;
        let collisionY = this._entity.worldY + startPoint.y - directionVector.y * collidingDistance;
        return {
            x: collisionX,
            y: collisionY,
            normalX: -directionVector.x * collidingDistance,
            normalY: -directionVector.y * collidingDistance
        };
    }
    getOutlineVector(cornerIndex) {
        const startVertex = this.vertices[cornerIndex];
        let endVertex = this.vertices[0];
        if (cornerIndex < this.vertices.length - 1) {
            endVertex = this.vertices[cornerIndex + 1];
        }
        const dirX = endVertex.x - startVertex.x;
        const dirY = endVertex.y - startVertex.y;
        return { x: dirX, y: dirY };
    }
    getNormals(vertices) {
        let result = [];
        for (let n = 0; n < vertices.length; n++) {
            let nextN = (n == vertices.length - 1) ? 0 : n + 1;
            let normal = {
                x: vertices[n].y - vertices[nextN].y,
                y: vertices[nextN].x - vertices[n].x
            };
            let magnitude = algebra.magnitude(normal.x, normal.y);
            if (magnitude == 0)
                return;
            normal.x /= magnitude;
            normal.y /= magnitude;
            result.push(normal);
        }
        return result;
    }
    getBoundingBox(vertices) {
        let result = {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        };
        if (vertices.length == 0)
            return result;
        for (let n = 0; n < vertices.length; n++) {
            let x = vertices[n].x;
            let y = vertices[n].y;
            if (x < result.left)
                result.left = x;
            if (x > result.right)
                result.right = x;
            if (y < result.top)
                result.top = y;
            if (y > result.bottom)
                result.bottom = y;
        }
        return result;
    }
    getShadowOnAxis(axisX, axisY) {
        let vertices = this.vertices;
        if (vertices.length == 0)
            return null;
        let worldVert = this.getVertexWorldPosition(vertices[0]);
        let maxScalar = algebra.dot(axisX, axisY, worldVert.x, worldVert.y);
        let minScalar = maxScalar;
        for (let n = 1; n < vertices.length; n++) {
            let vert = vertices[n];
            worldVert = this.getVertexWorldPosition(vert);
            // Projectsion: (vert • axis) / ||axis||
            // Since the axis is normalised, there is no need to divide by its magnitude to get the projectsion
            let scalar = algebra.dot(axisX, axisY, worldVert.x, worldVert.y);
            maxScalar = Math.max(scalar, maxScalar);
            if (scalar < minScalar) {
                minScalar = scalar;
            }
        }
        return { minScalar: minScalar, maxScalar: maxScalar };
    }
    max(a, b) {
        if (this.sqrMag(a.x, a.y) > this.sqrMag(b.x, b.y))
            return a;
        return b;
    }
    sqrMag(x, y) {
        return (x * x) + (y * y);
    }
    overlapsPoint(pointX, pointY) {
        let boundingBox = this.getBoundingBox(this._vertices);
        let rayCastStart = {
            x: boundingBox.left - 10 + this._entity.worldX,
            y: boundingBox.top + this._entity.worldY - 10
        };
        let raycastEnd = { x: pointX, y: pointY };
        let rayHits = this.getCollisionPointsWithRay(rayCastStart.x, rayCastStart.y, raycastEnd.x, raycastEnd.y);
        // By raycasting from a point outside the collider into the checked point, if the point is inside the collider
        // the ray should hit exactly once.
        return rayHits.length % 2 != 0;
    }
    getNearestPoint(targetX, targetY) {
        return null;
    }
    getNearestBoundingPoint(targetX, targetY) {
        let nearestPoint = { x: -1, y: -1 };
        if (this._vertices.length < 1)
            return nearestPoint;
        let nearestDistance = Number.MAX_SAFE_INTEGER;
        for (let n = 0; n < this._vertices.length; n++) {
            let lineStart = this.getVertexWorldPosition(this._vertices[n]);
            let direction = this.getOutlineVector(n);
            let result = closestPointOnLine(targetX, targetY, lineStart.x, lineStart.y, lineStart.x + direction.x, lineStart.y + direction.y);
            // If no orthogonal point is found, the closest possible should be the corner.
            if (!this.isInVertRange(result.x, result.y, n))
                result = lineStart;
            let distance = algebra.squareDistance(result.x, result.y, targetX, targetY);
            if (distance < nearestDistance) {
                console.log("sqrDist: ", distance);
                console.log("start: ", lineStart);
                console.log("direction: ", direction);
                console.log("point: ", result);
                nearestDistance = distance;
                nearestPoint = result;
            }
        }
        return nearestPoint;
    }
    isInVertRange(x, y, vertIndex, local = false) {
        let vertNow = this._vertices[vertIndex];
        let vertNext = this._vertices[vertIndex >= this._vertices.length - 1 ? 0 : vertIndex + 1];
        if (!local) {
            vertNow = this.getVertexWorldPosition(vertNow);
            vertNext = this.getVertexWorldPosition(vertNext);
        }
        let minX = Math.min(vertNow.x, vertNext.x);
        let minY = Math.min(vertNow.y, vertNext.y);
        let maxX = Math.max(vertNow.x, vertNext.x);
        let maxY = Math.max(vertNow.y, vertNext.y);
        return x >= minX && x <= maxX && y >= minY && y <= maxY;
    }
    getFirstCollisionPointWithRay(x0, y0, xDir, yDir) {
        return null;
    }
    getCollisionPointsWithRay(x0, y0, x1, y1) {
        let rayStart = { x: Math.min(x0, x1), y: Math.min(y0, y1) };
        let rayEnd = { x: Math.max(x0, x1), y: Math.max(y0, y1) };
        let rayLean = x1 == x0 ? 0 : (y1 - y0) / (x1 - x0);
        let result = [];
        for (let n = 0; n < this._vertices.length; n++) {
            let nextVertIndex = n < this._vertices.length - 1 ? n + 1 : 0;
            let currentVert = this.getVertexWorldPosition(this._vertices[n]);
            let nextVert = this.getVertexWorldPosition(this._vertices[nextVertIndex]);
            let vertStart = {
                x: Math.min(currentVert.x, nextVert.x),
                y: Math.min(currentVert.y, nextVert.y)
            };
            let vertEnd = {
                x: Math.max(currentVert.x, nextVert.x),
                y: Math.max(currentVert.y, nextVert.y)
            };
            let lineVector = this.getOutlineVector(n);
            let lineVectorLean = lineVector.y / lineVector.x;
            let linePoint = currentVert;
            let overlap = algebra.getLineOverlapPoint(linePoint.x, linePoint.y, lineVectorLean, x0, y0, rayLean);
            let startX = Math.max(vertStart.x, rayStart.x);
            let startY = Math.max(vertStart.y, rayStart.y);
            let endX = Math.min(vertEnd.x, rayEnd.x);
            let endY = Math.min(vertEnd.y, rayEnd.y);
            let isOnLine = (overlap.x > startX && overlap.x < endX
                && overlap.y > startY && overlap.y < endY);
            if (!isOnLine)
                continue;
            let normal = this._normals[n];
            result.push({
                x: overlap.x,
                y: overlap.y,
                normalX: normal.x,
                normalY: normal.y
            });
        }
        return result;
    }
    pointIsOnLineSegment(pointX, pointY, lineStartX, lineStartY, lineEndX, lineEndY) {
        let lineVector = {
            x: lineEndX - lineStartX,
            y: lineEndY - lineStartY
        };
        if (algebra.angleBetween(lineVector.x, lineVector.y, pointX, pointY) > 0.00001)
            return false;
        return pointX > lineStartX && pointX < lineEndX
            && pointY > lineStartY && pointY < lineEndY;
    }
    getNearestCorner(x, y) {
        return null;
    }
    getVertexWorldPosition(point) {
        let x = point.x + this.entity.worldX;
        let y = point.y + this.entity.worldY;
        return { x: x, y: y };
    }
    getVertexViewPosition(point, viewX, viewY) {
        let worldPoint = this.getVertexWorldPosition(point);
        let x = worldPoint.x - viewX;
        let y = worldPoint.y - viewY;
        return { x: x, y: y };
    }
}
