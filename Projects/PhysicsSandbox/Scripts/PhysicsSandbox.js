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
        console.log("Colliding vertex index: ", collidingIndex);
        let directionVector = this._normals[collidingIndex];
        let collisionX = startVertex.x - directionVector.x * collidingDistance;
        let collisionY = startVertex.y - directionVector.y * collidingDistance;
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

class SatRigidbody {
    constructor(transform) {
        this.dragEnabled = true;
        this._velocity = { x: 0, y: 0 };
        this._onDestroy = new Action();
        // private _deltaTime: number;
        this._onCollisionEnter = new Action();
        this._onCollisionExit = new Action();
        this._onCollisionStay = new Action();
        this._transform = transform;
        this._previousX = transform.x;
        this._previousY = transform.y;
        this._drag = new PercentageDrag(5);
    }
    /*
    // TODO: Implement collision stay & triggers
    private readonly _activeCollisionData: {
        collider: ICollider,
        updateCount: number,
        lastUpdateCount: number
    }[] = [];
    */
    set velocity(value) { this._velocity = value; }
    get velocity() { return this._velocity; }
    get onCollisionEnter() { return this._onCollisionEnter; }
    get onCollisionExit() { return this._onCollisionExit; }
    get onCollisionStay() { return this._onCollisionStay; }
    get onDestroy() { return this._onDestroy; }
    get entity() { return this._transform; }
    update(deltaTime) {
        // this._deltaTime = deltaTime;
        if (this.dragEnabled) {
            this.applyDrag(deltaTime);
        }
        this.move(deltaTime);
    }
    destroy() {
        this._loopAction.remove(this._updateActionId);
        this._onDestroy.invoke();
    }
    checkCollision(colliders) {
        colliders.forEach(collider => {
            if (collider.overlapsPoint(this._transform.x, this._transform.y)) {
                let x0 = this._previousX;
                let y0 = this._previousY;
                let x1 = this._transform.x;
                let y1 = this._transform.y;
                let dX = this._transform.x - this._previousX;
                let dY = this._transform.y - this._previousY;
                let lean = dY / dX;
                if (dX == 0)
                    lean = 100000;
                let collisionData = collider.getCollisionPointWithRay(x0, y0, dX, dY);
                if (collisionData == null)
                    return;
                let deltaColX = collisionData.x - x1;
                let deltaColY = collisionData.y - y1;
                this._velocity.x -= collisionData.normalX * this._velocity.x * -Math.sign(dX);
                this._velocity.y -= collisionData.normalY * this._velocity.y * -Math.sign(dY);
                this._transform.x -= collisionData.normalX * deltaColX * -Math.sign(deltaColX);
                this._transform.y -= collisionData.normalY * deltaColY * -Math.sign(deltaColY);
                this._onCollisionEnter.invoke.call(this._onCollisionEnter, collisionData, collider);
            }
        });
    }
    setDragProfile(drag) {
        if (drag == null)
            return;
        this._drag = drag;
    }
    move(deltaTime) {
        if (deltaTime == undefined || deltaTime <= 0)
            return;
        this._previousX = this._transform.x;
        this._previousY = this._transform.y;
        this._transform.x += deltaTime * this._velocity.x;
        this._transform.y += deltaTime * this._velocity.y;
    }
    applyDrag(deltaTime) {
        let drag = this._drag.getDrag(this._velocity.x, this._velocity.y);
        this._velocity.x -= drag.dragX * deltaTime;
        this._velocity.y -= drag.dragY * deltaTime;
    }
}

let gameData;
let various = {};
function start(canvasId) {
    let renderLayers = createRenderLayers();
    let mainLoop = new Loop(60);
    let cameraTransform = new Transform(0, 0);
    let camera = createCamera(renderLayers, cameraTransform, mainLoop, canvasId);
    let collisionSpaces = [new CollisionSpace()];
    let physics = new PhysicsSpace(mainLoop, collisionSpaces);
    gameData = {
        mainLoop: mainLoop,
        renderLayers: renderLayers,
        physics: physics
    };
    let mouseBox = createSatBox(); // new VisibleBoxCollider(0, 0, 10, 10, renderLayers[1], new CollisionSpace(), "red", false);
    let staticBox = createSatBox();
    let collisionRenderBox = createSatBox("red", 5);
    // let mousePhysics = new PointRigidBody(mouseCollider.entity);
    renderLayers[1].addRenderable(mouseBox.renderer);
    renderLayers[1].addRenderable(staticBox.renderer);
    renderLayers[1].addRenderable(collisionRenderBox.renderer);
    collisionSpaces[0].addCollider(staticBox.collider);
    onMouseMoved.add(() => {
        var mousePosition = camera.getMouseWorldPosition();
        // let x = mousePosition.x + camera.viewFrustum.width * 0.5;
        // let y = mousePosition.y + camera.viewFrustum.height * 0.5;
        // mousePosition = {x: x, y: y};
        mouseBox.collider.entity.worldX = mousePosition.x;
        mouseBox.collider.entity.worldY = mousePosition.y;
        // console.log(mousePosition);
    }, mouseBox);
    onMouseDown.add(() => {
        console.log("Mouse down");
        let collisionData = mouseBox.collider.GetCollisionPoint(staticBox.collider);
        console.log(collisionData);
        if (collisionData == null)
            return;
        collisionRenderBox.collider.entity.worldX = mouseBox.collider.entity.worldX + collisionData.x;
        collisionRenderBox.collider.entity.worldY = mouseBox.collider.entity.worldY + collisionData.y;
    }, mouseBox);
}
function createRenderLayers() {
    return [
        new RenderLayer(),
        new RenderLayer() // Actors
    ];
}
function createCamera(renderLayers, transform, loop, canvasId) {
    let camera = new Camera(renderLayers, transform, loop);
    let canvas = document.getElementById(canvasId);
    windowEvents.onWindowResize.add((_) => {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    }, canvas);
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    camera.setCanvas(canvas);
    return camera;
}
function createTestBoxes(renderspace, collisionSpace) {
    let amount = 10;
    let result = [];
    let width = 50;
    let height = width;
    for (let n = 0; n < amount; n++) {
        let x = n * width;
        let y = 0;
        let box = new VisibleBoxCollider(x, y, width, height, renderspace, collisionSpace);
        result.push(box);
    }
    return result;
}
function createSatBox(color = "black", size = 50) {
    let entity = new Entity(0, 0);
    let half = size * 0.5;
    let vertices = [
        { x: -half, y: -half },
        { x: -half, y: half },
        { x: half, y: half },
        { x: half, y: -half }
    ];
    let result = new SatCollider(entity, 0, 0, vertices);
    let renderer = new SatColliderRenderer(result, color);
    return { collider: result, renderer: renderer };
}

class WindowEvents {
    constructor() {
        this.onWindowResize = new Action();
        window.onresize = () => this.onWindowResize.invoke(window);
    }
}
const windowEvents = new WindowEvents();

