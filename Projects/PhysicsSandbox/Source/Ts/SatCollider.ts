// TODO: Implement normals calculation
// TODO: Implement collision
class SatCollider implements ICollider {
    private _entity: Entity;
    private _vertices: { x: number, y: number }[];
    private _normals: { x: number, y: number }[];
    private _offsetX: number;
    private _offsetY: number;
    private _onDestroy: Action;

    get vertices(): { x: number, y: number }[] {
        return this._vertices;
    }
    get offset(): { x: number, y: number } {
        return {
            x: this._offsetX,
            y: this._offsetY
        }
    }
    get onDestroy(): Action { return this._onDestroy; }
    get entity(): Entity { return this._entity }
    get centre(): { x: number, y: number } {
        let x = this._entity.transform.x + this.offset.x;
        let y = this._entity.transform.y + this.offset.y;
        return { x: x, y: y };
    }
    get normals(): {x: number, y: number}[]{
        return this._normals;
    }

    constructor(entity: Entity, offsetX: number = 0, offsetY: number = 0, vertices: { x: number, y: number }[]) {
        this._entity = entity;
        this._vertices = vertices;
        this._offsetX = offsetX;
        this._offsetY = offsetY;
        this._normals = this.getNormals(vertices);

        this._onDestroy = new Action();
    }

    destroy(): void {
        this._onDestroy.invoke();
    }

    public GetCollisionPoint(other: SatCollider): { x: number, y: number } {
        let vertices = this._vertices;
        if (vertices.length < 2) return;
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
                console.log("Normal is away from other collider entity, ignoring")
                console.log("from to other vector: ", distX, distY);
                console.log("Dot product with normal: ", angleDot);
                continue;
            }

            let myProjection = this.getShadowOnAxis(axis.x, axis.y);
            let theirProjection = other.getShadowOnAxis(axis.x, axis.y);
            
            console.log("Projections:", myProjection, theirProjection);

            if (myProjection.minScalar > theirProjection.maxScalar
            ||  myProjection.maxScalar < theirProjection.minScalar) {
                // No shadow overlap -> no collision, quit
                console.log("No overlap for projections: ", myProjection, theirProjection);
                return null;
            }
            // Collision found - compare distance to determine if that's the closest to push out
            let pen0 = Math.max(myProjection.minScalar, theirProjection.minScalar);
            let pen1 = Math.min(myProjection.maxScalar, theirProjection.maxScalar);
            let penetration = Math.abs(pen1 - pen0);
            console.log("Penetration: " + penetration);
            if (penetration > collidingDistance && n > 0) continue;
            if (penetration == collidingDistance)  {
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
        if (collidingIndex < vertices.length - 1) endVertex = vertices[collidingIndex + 1];
        console.log("Colliding vertex index: ", collidingIndex);
        let directionVector = this._normals[collidingIndex]
        let collisionX = startVertex.x - directionVector.x * collidingDistance;
        let collisionY = startVertex.y - directionVector.y * collidingDistance;
        return {x: collisionX, y: collisionY};
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

    public getCollisionPointWithRay(x0: number, y0: number, xDir: number, yDir: number): { x: number, y: number, normalX: number, normalY: number } {
        return null;
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