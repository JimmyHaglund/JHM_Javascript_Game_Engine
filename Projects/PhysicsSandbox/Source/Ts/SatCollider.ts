// TODO: Implement normals calculation
// TODO: Implement collision
class SatCollider implements ICollider {
    private _entity: Entity;
    private _vertices: { x: number, y: number }[];
    private _normals: { x: number, y: number }[];
    private _onDestroy: Action;
    private _boundingBox: { left:number, right: number, top:number, bottom: number };

    get vertices(): { x: number, y: number }[] {
        return this._vertices;
    }
    get onDestroy(): Action { return this._onDestroy; }
    get entity(): Entity { return this._entity }
    get normals(): {x: number, y: number}[]{
        return this._normals;
    }
    get boundingBox(): { left:number, right: number, top:number, bottom: number } {
        return this._boundingBox;
    }
    get centre(): {x: number, y: number} {
        const bounds = this.boundingBox;
        const x = bounds.left + (bounds.right - bounds.left) * 0.5; 
        const y = bounds.top + (bounds.bottom - bounds.top) * 0.5;
        return {x, y};
    }
    get worldCentre(): {x: number, y: number} {
        const localCentre = this.centre;
        return {
            x: localCentre.x + this.entity.worldX,
            y: localCentre.y + this.entity.worldY
        }
    }

    constructor(entity: Entity, offsetX: number = 0, offsetY: number = 0, vertices: { x: number, y: number }[]) {
        this._entity = entity;
        this._vertices = vertices;
        this._normals = this.getNormals(vertices);
        this._boundingBox = this.getBoundingBox(vertices);

        this._onDestroy = new Action();
    }

    destroy(): void {
        this._onDestroy.invoke();
    }

    public getCollision(other: ICollider, checkOther: boolean = true): { x: number, y: number, normalX: number, normalY: number} {
        let vertices = this._vertices;
        if (vertices.length < 2) return;
        let collidingIndex = -1;
        let collidingDistance = Number.MAX_SAFE_INTEGER;
        for (let n = 0; n < vertices.length; n++) {
            let axis = this._normals[n];
            let otherCentre = other.worldCentre;
            let myCentre = this.worldCentre;
            let distX = otherCentre.x - myCentre.x;
            let distY = otherCentre.y - myCentre.y;
            let angleDot = algebra.dot(distX, distY, axis.x, axis.y);
            if (angleDot < 0) continue;

            let myProjection = this.getShadowOnAxis(axis.x, axis.y);
            let theirProjection = other.getShadowOnAxis(axis.x, axis.y);

            if (myProjection.minScalar > theirProjection.maxScalar
            ||  myProjection.maxScalar < theirProjection.minScalar) {
                // No shadow overlap -> no collision, quit
                return null;
            }
            // Collision found - compare distance to determine if that's the closest to push out
            let pen0 = Math.max(myProjection.minScalar, theirProjection.minScalar);
            let pen1 = Math.min(myProjection.maxScalar, theirProjection.maxScalar);
            let penetration = Math.abs(pen1 - pen0);
            if (penetration > collidingDistance && n > 0) continue;
            if (penetration == collidingDistance)  {
                // projecting two opposite, symmetrical sides would yield the same shadow.
                // Use the vertex with min distance to the other
            }
            collidingDistance = penetration;
            collidingIndex = n; 
        }
        // Do same thing for other polygon's vertices
        if (checkOther) {
            let otherCollision = other.getCollision(this, false);
            if (otherCollision == null) return null;
            if (algebra.squareDistance(0, 0, otherCollision.normalX, otherCollision.normalY) < collidingDistance) {
                otherCollision.normalX *= -1;
                otherCollision.normalY *= -1;
                return otherCollision;
            }
        }
        let startVertex = vertices[collidingIndex];
        let endVertex = vertices[0];
        if (collidingIndex < vertices.length - 1) endVertex = vertices[collidingIndex + 1];
        let startPoint = {
            x: startVertex.x + 0.5 * (endVertex.x - startVertex.x), 
            y: startVertex.y + 0.5 * (endVertex.y - startVertex.y)
        };
        let directionVector = this._normals[collidingIndex]
        let collisionX = this._entity.worldX + startPoint.x - directionVector.x * collidingDistance;
        let collisionY = this._entity.worldY + startPoint.y - directionVector.y * collidingDistance;
        return {
            x: collisionX, 
            y: collisionY, 
            normalX: -directionVector.x * collidingDistance, 
            normalY: -directionVector.y * collidingDistance
        };
    }

    private getOutlineVector(cornerIndex: number): {dirX: number, dirY: number} {
        const startVertex = this.vertices[cornerIndex];
        let endVertex = this.vertices[0];
        if (cornerIndex < this.vertices.length - 1) {
            endVertex = this.vertices[cornerIndex + 1];
        }
        const dirX = endVertex.x - startVertex.x;
        const dirY = endVertex.y - startVertex.y;
        return {dirX, dirY};
    }

    private getNormals(vertices: {x: number, y: number}[]) : {x:number, y:number}[] {
        let result: {x: number, y: number}[] = [];
        for(let n = 0; n < vertices.length; n++) {
            let nextN = (n == vertices.length - 1) ? 0 : n + 1;
            let normal = {
                x: vertices[n].y - vertices[nextN].y,
                y: vertices[nextN].x - vertices[n].x
            }
            let magnitude = algebra.magnitude(normal.x, normal.y);
            if (magnitude == 0) return;
            normal.x /= magnitude;
            normal.y /= magnitude;
            result.push(normal);
        }
        return result;
    }

    private getBoundingBox(vertices: {x: number, y: number}[]) : { left:number, right: number, top:number, bottom: number } {
        let result = {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        }
        if (vertices.length == 0) return result;
        for(let n = 0; n < vertices.length; n++) {
            let x = vertices[n].x;
            let y = vertices[n].y;
            if (x < result.left) result.left = x;
            if (x > result.right) result.right = x;
            if (y < result.top) result.top = y;
            if (y > result.bottom) result.bottom = y;
        }
        return result;
    }

    public getShadowOnAxis(axisX: number, axisY: number): { minScalar: number, maxScalar: number } {
        let vertices = this.vertices;
        if (vertices.length == 0) return null;
        let worldVert = this.getVertexWorldPosition(vertices[0]);
        let maxScalar = algebra.dot(axisX, axisY, worldVert.x, worldVert.y)
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

    private max(a: { x: number, y: number }, b: { x: number, y: number }): { x: number, y: number } {
        if (this.sqrMag(a.x, a.y) > this.sqrMag(b.x, b.y)) return a;
        return b;
    }

    private sqrMag(x: number, y: number): number {
        return (x * x) + (y * y)
    }

    public overlapsPoint(pointX: number, pointY: number): boolean {
        return false;
    }

    public getNearestPoint(pointX: number, pointY: number): {x: number, y: number} {
        return null;
    }

    public getNearestBoundingPoint(pointX: number, pointY: number): {x: number, y: number}{
        return null;
    }
    public getFirstCollisionPointWithRay(x0: number, y0: number, xDir: number, yDir: number): 
    { x: number, y: number, normalX: number, normalY: number } {
        return null;
    }

    public getCollisionPointsWithRay(x0: number, y0: number, lean: number, length: number):
    { x: number, y: number, normalX: number, normalY: number }[] {

        let rayLean = lean;
        let result: { 
            x: number, 
            y: number, 
            normalX: number, 
            normalY: number 
        }[] = [];
        for(let n = 0; n < this._vertices.length; n++) {
            let worldVertice = this.getVertexWorldPosition(this._vertices[n]);
            
            let nextVertIndex = n < this._vertices.length -1 ? n + 1 : 0;
            let endVert = this.getVertexWorldPosition(this._vertices[nextVertIndex]);
            
            let lineVector = this.getOutlineVector(n);
            let lineVectorLean = lineVector.dirY / lineVector.dirX;
            let linePoint = worldVertice;
            let overlap = algebra.getLineOverlapPoint(
                linePoint.x, linePoint.y, lineVectorLean,
                x0, y0, rayLean);
            
            let startX = Math.min(worldVertice.x, endVert.x);
            let startY = Math.min(worldVertice.y, endVert.y);
            let endX = Math.max(worldVertice.x, endVert.x);
            let endY = Math.max(worldVertice.y, endVert.y);
            let isOnLine = ( overlap.x > startX && overlap.x < endX 
            && overlap.y > startY && overlap.y < endY);
            if (!isOnLine) continue;
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

    private pointIsOnLineSegment(pointX, pointY, lineStartX, lineStartY, lineEndX, lineEndY): boolean {
        let lineVector = {
            x: lineEndX - lineStartX, 
            y: lineEndY - lineStartY
        };
        if (algebra.angleBetween(lineVector.x, lineVector.y, pointX, pointY) > 0.00001) return false;
        return pointX > lineStartX && pointX < lineEndX 
            && pointY > lineStartY && pointY < lineEndY;
    }


    public getNearestCorner(x: number, y: number): { x: number, y: number } {
        return null;
    }

    private getVertexWorldPosition(point: { x: number, y: number }): { x: number, y: number } {
        let x = point.x + this.entity.worldX;
        let y = point.y + this.entity.worldY;
        return { x: x, y: y };
    }

    private getVertexViewPosition(point: { x: number, y: number }, viewX: number, viewY: number): { x: number, y: number } {
        let worldPoint = this.getVertexWorldPosition(point);
        let x = worldPoint.x - viewX;
        let y = worldPoint.y - viewY;
        return { x: x, y: y };
    }
}