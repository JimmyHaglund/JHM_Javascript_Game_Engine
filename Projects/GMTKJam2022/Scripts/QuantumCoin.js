// TODO: Implement normals calculation
// TODO: Implement collision
class SatCollider {
    constructor(entity, offsetX = 0, offsetY = 0, vertices) {
        this._entity = entity;
        this._vertices = vertices;
        this._offsetX = offsetX;
        this._offsetY = offsetY;
        this._normals = this.getNormals(vertices);
        this._onDestroy = new Action();
    }
    get vertices() {
        return this._vertices;
    }
    get offset() {
        return {
            x: this._offsetX,
            y: this._offsetY
        };
    }
    get onDestroy() { return this._onDestroy; }
    get entity() { return this._entity; }
    get centre() {
        let x = this._entity.transform.x + this.offset.x;
        let y = this._entity.transform.y + this.offset.y;
        return { x: x, y: y };
    }
    get normals() {
        return this._normals;
    }
    destroy() {
        this._onDestroy.invoke();
    }
    GetCollisionPoint(other) {
        let vertices = this._vertices;
        if (vertices.length < 2)
            return;
        let collidingIndex = -1;
        let collidingDistance = Number.MAX_SAFE_INTEGER;
        console.log(vertices);
        for (let n = 0; n < vertices.length; n++) {
            let axis = this._normals[n];
            console.log("Axis:", axis);
            let distX = other.entity.worldX - this.entity.worldX;
            let distY = other.entity.worldY - this.entity.worldY;
            let angleDot = algebra.dot(distX, distY, axis.x, axis.y);
            if (angleDot < 0) {
                // TODO: Major bug potential here, need to check centre of polygon instead of 
                // the entity  since the collider may be offset away from the entity.
                console.log("Normal is away from other collider entity, ignoring");
                console.log("from to other vector: ", distX, distY);
                console.log("Dot product with normal: ", angleDot);
                continue;
            }
            let myProjection = this.getShadowOnAxis(axis.x, axis.y);
            let theirProjection = other.getShadowOnAxis(axis.x, axis.y);
            console.log("Projections:", myProjection, theirProjection);
            if (myProjection.minScalar > theirProjection.maxScalar
                || myProjection.maxScalar < theirProjection.minScalar) {
                // No shadow overlap -> no collision, quit
                console.log("No overlap for projections: ", myProjection, theirProjection);
                return null;
            }
            // Collision found - compare distance to determine if that's the closest to push out
            let pen0 = Math.max(myProjection.minScalar, theirProjection.minScalar);
            let pen1 = Math.min(myProjection.maxScalar, theirProjection.maxScalar);
            let penetration = Math.abs(pen1 - pen0);
            console.log("Penetration: " + penetration);
            if (penetration > collidingDistance && n > 0)
                continue;
            if (penetration == collidingDistance) {
                // projecting two opposite, symmetrical sides would yield the same shadow.
                // Use the vertex with min distance to the other
            }
            collidingDistance = penetration;
            collidingIndex = n;
        }
        if (collidingIndex == -1) {
            console.log("CollidingIndex -1");
            return null;
        }
        let startVertex = vertices[collidingIndex];
        let endVertex = vertices[0];
        if (collidingIndex < vertices.length - 1)
            endVertex = vertices[collidingIndex + 1];
        let startPoint = {
            x: startVertex.x + 0.5 * (endVertex.x - startVertex.x),
            y: startVertex.y + 0.5 * (endVertex.y - startVertex.y)
        };
        console.log("Colliding vertex index: ", collidingIndex);
        let directionVector = this._normals[collidingIndex];
        let collisionX = startPoint.x - directionVector.x * collidingDistance;
        let collisionY = startPoint.y - directionVector.y * collidingDistance;
        return { x: collisionX, y: collisionY };
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
        return false;
    }
    getCollisionPointWithRay(x0, y0, xDir, yDir) {
        return null;
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

class SatColliderRenderer {
    constructor(collider, color = 'black') {
        this._onDestroy = new Action();
        this._collider = collider;
        this._color = color;
    }
    get onDestroy() { return this._onDestroy; }
    render(context, viewX, viewY) {
        let points = this._collider.vertices;
        if (points == null || points.length == 0)
            return;
        let point = this.getVertexViewPosition(points[0], viewX, viewY);
        context.fillStyle = this._color;
        context.strokeStyle = this._color;
        context.beginPath();
        context.moveTo(point.x, point.y);
        for (let p = 1; p < points.length; p++) {
            point = this.getVertexViewPosition(points[p], viewX, viewY);
            context.lineTo(point.x, point.y);
        }
        context.closePath();
        context.stroke();
        context.strokeStyle = "red";
        for (let n = 0; n < this._collider.normals.length; n++) {
            let nextN = (n == this._collider.vertices.length - 1) ? 0 : n + 1;
            let pointA = this.getVertexViewPosition(points[n], viewX, viewY);
            let pointB = this.getVertexViewPosition(points[nextN], viewX, viewY);
            let directionX = 0.5 * (pointB.x - pointA.x);
            let directionY = 0.5 * (pointB.y - pointA.y);
            let start = { x: pointA.x + directionX, y: pointA.y + directionY };
            let normal = this._collider.normals[n];
            let end = { x: start.x + normal.x * 10, y: start.y + normal.y * 10 };
            context.beginPath();
            context.moveTo(start.x, start.y);
            context.lineTo(end.x, end.y);
            context.stroke();
        }
        // render(context: CanvasRenderingContext2D, viewX:number, viewY:number): void {
        //    context.beginPath();
        //    let contextColor = context.fillStyle;
        //    let left = this._collider.left - viewX;
        //    let right = this._collider.right - viewX;
        //    let top = this._collider.top - viewY;
        //    let bottom = this._collider.bottom - viewY;
    }
    destroy() {
        this._onDestroy.invoke();
    }
    getVertexWorldPosition(point) {
        let x = point.x + this._collider.entity.worldX;
        let y = point.y + this._collider.entity.worldY;
        return { x: x, y: y };
    }
    getVertexViewPosition(point, viewX, viewY) {
        let worldPoint = this.getVertexWorldPosition(point);
        let x = worldPoint.x - viewX;
        let y = worldPoint.y - viewY;
        return { x: x, y: y };
    }
}

// Dependencies: SatCollider SatColliderRenderer

