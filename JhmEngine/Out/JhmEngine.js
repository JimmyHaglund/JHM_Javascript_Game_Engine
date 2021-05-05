class Action {
    constructor() {
        this._actions = [];
        this._nextId = 0;
    }
    add(delegateFunction, invoker) {
        this._actions.push({
            id: this._nextId,
            action: delegateFunction,
            invoker: invoker
        });
        return this._nextId++;
    }
    remove(actionId) {
        let index = this._actions.findIndex((value) => value.id == actionId);
        if (index == -1)
            return;
        this._actions.splice(index, 1);
    }
    invoke(...args) {
        for (let n = 0; n < this._actions.length; n++) {
            let a = this._actions[n].action;
            this._actions[n].action.call(this._actions[n].invoker, args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9]);
        }
    }
}

let algebra = {
    getLineOverlapPoint: function (xA, yA, leanA, xB, yB, leanB) {
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
    squareDistance: function (x0, y0, x1, y1) {
        return (x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0);
    },
    insideRange: function (value, rangeA, rangeB) {
        let min = rangeA > rangeB ? rangeB : rangeA;
        let max = rangeA < rangeB ? rangeB : rangeA;
        return (value >= Math.floor(min) && value <= Math.ceil(max));
    },
    magnitude(x, y) {
        if (x == 0 && y == 0)
            return 0;
        return Math.sqrt(x * x + y * y);
    },
    normalize(x, y) {
        let magnitude = algebra.magnitude(x, y);
        return {
            x: x / magnitude,
            y: y / magnitude
        };
    },
    dot(x1, y1, x2, y2) {
        return x1 * x2 + y1 * y2;
    },
    angleBetween(x1, y1, x2, y2) {
        let magnitude1 = algebra.magnitude(x1, y1);
        let magnitude2 = algebra.magnitude(x2, y2);
        let dotProduct = algebra.dot(x1, y1, x2, y2);
        let cosineOfAngle = algebra.dot(x1, y1, x2, y2) / (magnitude1 * magnitude2);
        if (magnitude1 == 0 && magnitude2 == 0)
            return 0;
        return Math.acos(cosineOfAngle);
    },
    angleFromToCounterClockwise(x1, y1, x2, y2) {
        let right = vector.right;
        let pi = Math.PI;
        let getRotation = function (x, y) {
            let angleFromRight = algebra.angleBetween(right.x, right.y, x, y);
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
    },
    rotate(x, y, angle) {
        return {
            x: x * Math.cos(angle) - y * Math.sin(angle),
            y: x * Math.sin(angle) + y * Math.cos(angle)
        };
    }
};
class Line {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
}

class Entity {
    constructor(positionX = 0, positionY = 0) {
        this._transform = new Transform();
        this._components = [];
        this._onDestroy = new Action();
        this._transform.x = positionX;
        this._transform.y = positionY;
    }
    get onDestroy() { return this._onDestroy; }
    get transform() { return this._transform; }
    get components() { return this._components; }
    destroy() {
        this.onDestroy.invoke;
    }
    addComponent(component, id) {
        this._components.push({ component: component, id: id });
    }
    removeComponent(component) {
        let index = this._components.indexOf(component);
        if (index == -1)
            return;
        this._components.splice(index, 1);
    }
    getComponent(type) {
        for (let n = 0; n < this._components.length; n++) {
            if (type.Implements(this._components[n].id)) {
                return this._components[n].component;
            }
        }
        return null;
    }
    get x() { return this._transform.x; }
    set x(value) { this._transform.x = value; }
    get y() { return this._transform.y; }
    set y(value) { this._transform.y = value; }
    get worldX() { return this._transform.worldX; }
    set worldX(value) { this._transform.worldX = value; }
    get worldY() { return this._transform.worldY; }
    set worldY(value) { this._transform.worldY = value; }
    get rotation() { return this._transform.rotation; }
    set rotation(value) { this._transform.rotation = value; }
    get parent() { return this._transform.parent; }
    set parent(value) { this._transform.parent = value; }
}



class Loop {
    constructor(ticksPerSecond = 60, startPaused = false) {
        this._interval = null;
        this._onUpdate = new Action();
        this._intervalTime = 1000 / ticksPerSecond;
        if (!startPaused)
            this.play();
    }
    get playing() {
        return this._interval != null;
    }
    get ticksPerSecond() {
        return this._intervalTime > 0 ? Math.round(1000 / this._intervalTime) : 0;
    }
    get onUpdate() {
        return this._onUpdate;
    }
    /* Note that when setting a new interval,
    the previous one won't carry over.
    so it's possible to continously stagger
    the update loop and never get a new tick.*/
    set ticksPerSecond(value) {
        if (this.ticksPerSecond != value) {
            this.pause();
        }
        if (value <= 0)
            this._intervalTime = 0;
        else
            this._intervalTime = 1000 / value;
        if (value > 0) {
            this.play();
        }
    }
    pause() {
        if (this._interval != null) {
            clearInterval(this._interval);
            this._interval = null;
        }
    }
    play() {
        if (this._intervalTime > 0 && this._interval == null) {
            this._interval = setInterval(() => this.update.call(this), this._intervalTime);
        }
    }
    update() {
        this._onUpdate.invoke(this._intervalTime / 1000);
    }
}

class Rect {
    constructor(left, top, width, height) {
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
    }
    get bottom() { return this.top + this.height; }
    ;
    get right() { return this.left + this.width; }
    ;
}

class Transform {
    constructor(positionX = 0, positionY = 0, rotation = 0, parent = null) {
        this._x = 0;
        this._y = 0;
        this._parent = null;
        this._rotation = null;
        this._x = positionX;
        this._y = positionY;
        this._rotation = rotation;
        this._parent = parent;
    }
    set x(value) { this._x = value; }
    get x() { return this._x; }
    set y(value) { this._y = value; }
    get y() { return this._y; }
    get position() { return { x: this.x, y: this.y }; }
    get worldX() { return this._parent == null ? this._x : this._parent.worldX + this._x; }
    set worldX(value) {
        this._x = this._parent == null ? value : value - this._parent.worldX;
    }
    get worldY() { return this._parent == null ? this._y : this._parent.worldY + this._y; }
    set worldY(value) {
        this._y = this._parent == null ? value : value - this._parent.worldY;
    }
    set parent(value) { this._parent = value; }
    get parent() { return this._parent; }
    set rotation(value) { this._rotation = value; }
    get rotation() { return this._rotation; }
}

class ClassId {
    constructor(implementedClasses) {
        this._implementedClasses = implementedClasses;
    }
    Implements(target) {
        if (target === this)
            return true;
        if (this._implementedClasses === null)
            return false;
        for (let n = 0; n < this._implementedClasses.length; n++) {
            if (this._implementedClasses[n].Implements(target))
                return true;
        }
        return false;
    }
}
let Type = {
    iComponent: new ClassId(null),
    iDestroyable: new ClassId(null),
    iLoop: new ClassId(null),
    iTransform: new ClassId(null),
    action: new ClassId(null),
    entity: new ClassId(null),
    loop: new ClassId(null),
    rect: new ClassId(null),
    transform: new ClassId(null),
    // Physics
    boxCollider: new ClassId(null),
    collisionSpace: new ClassId(null),
    iCollider: new ClassId(null),
    iDragProfile: new ClassId(null),
    iRigidbody: new ClassId(null),
    percentageDrag: new ClassId(null),
    physicsSpace: new ClassId(null),
    pointRigidbody: new ClassId(null),
    rayRender: new ClassId(null),
    rigidbody: new ClassId(null),
    sphereCollider: new ClassId(null),
    // Rendering
    boxColliderRenderer: new ClassId(null),
    camera: new ClassId(null),
    circleRenderer: new ClassId(null),
    iRenderable: new ClassId(null),
    iRenderLayer: new ClassId(null),
    renderLayer: new ClassId(null),
    rotatedSprite: new ClassId(null),
    sprite: new ClassId(null),
    tiledBackground: new ClassId(null)
};
Type.entity = new ClassId([Type.iDestroyable, Type.iTransform]);
Type.transform = new ClassId([Type.iTransform]);
Type.loop = new ClassId([Type.iLoop]);
// Rendering
Type.boxColliderRenderer = new ClassId([Type.iRenderable, Type.iDestroyable]);
Type.camera = new ClassId([Type.iDestroyable]);
Type.circleRenderer = new ClassId([Type.iRenderable, Type.iDestroyable]);
Type.renderLayer = new ClassId([Type.iRenderLayer]);
Type.sprite = new ClassId([Type.iRenderable, Type.iDestroyable, Type.iComponent]);
Type.rotatedSprite = new ClassId([Type.sprite]);

let vector = {
    up: { x: 0, y: -1 },
    right: { x: 1, y: 0 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    add: function (a, b) {
        return {
            x: a.x + b.x,
            y: a.y + b.y
        };
    }
};

class AudioComponent {
    constructor(audioId) {
        this._clip = document.getElementById(audioId);
    }
    set shouldLoop(value) { this._clip.loop = value; }
    play() {
        this._clip.play();
    }
    stopPlaying(reset = true) {
        this._clip.pause();
        if (reset)
            this._clip.currentTime = 0;
    }
}

class Binding {
    constructor(main = "", alternate = "") {
        this.mainBindingCode = "";
        this.alternateBindingCode = "";
        this.onPressed = new Action();
        this.onReleased = new Action();
        this._isDown = false;
        this.mainBindingCode = main;
        this.alternateBindingCode = alternate;
    }
    checkPressed(event) {
        if (this._isDown)
            return;
        let keyCode = event.code;
        switch (keyCode) {
            case this.mainBindingCode:
            case this.alternateBindingCode:
                this._isDown = true;
                this.notifyPressed();
                break;
            default:
                break;
        }
    }
    checkReleased(event) {
        if (!this._isDown)
            return;
        switch (event.code) {
            case this.mainBindingCode:
            case this.alternateBindingCode:
                this._isDown = false;
                this.notifyReleased();
                break;
            default:
                break;
        }
    }
    notifyPressed() {
        this.onPressed.invoke();
    }
    notifyReleased() {
        this.onReleased.invoke();
    }
}

let onMouseDown = new Action();
let onMouseUp = new Action();
function mouseDown(mouseEvent) {
    onMouseDown.invoke(mouseEvent);
}
function mouseUp(mouseEvent) {
    onMouseUp.invoke(mouseEvent);
}

let onMouseMoved = new Action();
function mouseMoved(mouseEvent) {
    onMouseMoved.invoke(mouseEvent);
}

class BoxCollider {
    constructor(entity, width, height, offsetX = 0, offsetY = 0) {
        this._entity = entity;
        this._width = width;
        this._height = height;
        this._offsetX = offsetX;
        this._offsetY = offsetY;
        this._onDestroy = new Action();
    }
    get left() { return this._entity.transform.worldX + this._offsetX; }
    get right() { return this.left + this._width; }
    get top() { return this._entity.transform.worldY + this._offsetY; }
    get bottom() { return this.top + this._height; }
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
    destroy() {
        this._onDestroy.invoke();
    }
    overlapsPoint(pointX, pointY) {
        return pointX > this.left && pointX < this.right
            && pointY < this.bottom && pointY > this.top;
    }
    getCollisionPointWithRay(x0, y0, xDir, yDir) {
        let corner = this.getNearestCorner(x0, y0);
        let lean = yDir / xDir;
        if (xDir == 0)
            lean = Math.sign(yDir) * 100000;
        let intersectVertical = null;
        let intersectHorizontal = null;
        // Only check for collision if ray has a chance of hitting the box
        let pointingAtBox = (corner.x > x0 && xDir > 0 || corner.x < x0 && xDir < 0 || algebra.insideRange(x0, this.left, this.right))
            && (corner.y > y0 && yDir > 0 || corner.y < y0 && yDir < 0 || algebra.insideRange(y0, this.top, this.bottom));
        if (pointingAtBox) {
            intersectVertical = algebra.getLineOverlapPoint(corner.x, corner.y, 100000, x0, y0, lean);
            intersectHorizontal = algebra.getLineOverlapPoint(corner.x, corner.y, 0, x0, y0, lean);
        }
        let foundHorizontal = false;
        let foundVertical = false;
        let intersectPoint = null;
        if (intersectHorizontal != null
            && algebra.insideRange(intersectHorizontal.x, this.left, this.right)) {
            foundHorizontal = true;
            intersectPoint = intersectHorizontal;
            intersectHorizontal.normalX = 0;
            intersectHorizontal.normalY = 1;
            if (corner.y == this.top) {
                intersectHorizontal.normalY = -1;
            }
        }
        if (intersectVertical != null
            && algebra.insideRange(intersectVertical.y, this.top, this.bottom)) {
            foundVertical = true;
            intersectPoint = intersectVertical;
            intersectVertical.normalY = 0;
            intersectVertical.normalX = 1;
            if (corner.x == this.left) {
                intersectVertical.normalX = -1;
            }
        }
        if (foundHorizontal && foundVertical) {
            if (algebra.squareDistance(intersectVertical.x, intersectVertical.y, x0, y0) <
                algebra.squareDistance(intersectHorizontal.x, intersectHorizontal.y, x0, y0)) {
                intersectPoint = intersectVertical;
            }
            else {
                intersectPoint = intersectHorizontal;
            }
        }
        return intersectPoint;
    }
    getNearestCorner(x, y) {
        let deltaLeft = Math.abs(this.left - x);
        let deltaRight = Math.abs(this.right - x);
        let deltaTop = Math.abs(this.top - y);
        let deltaBottom = Math.abs(this.bottom - y);
        return {
            x: deltaLeft < deltaRight ? this.left : this.right,
            y: deltaTop < deltaBottom ? this.top : this.bottom
        };
    }
    get corners() {
        return [
            { x: this.left, y: this.top },
            { x: this.right, y: this.top },
            { x: this.right, y: this.bottom },
            { x: this.left, y: this.bottom }
        ];
    }
}

class CollisionSpace {
    constructor() {
        this._colliders = [];
    }
    get colliders() { return this._colliders; }
    ;
    addCollider(collider) {
        let index = this._colliders.indexOf(collider);
        if (index >= 0)
            return;
        collider.onDestroy.add(() => {
            this.removeCollider(collider);
        }, this);
        this._colliders.push(collider);
    }
    removeCollider(collider) {
        let index = this._colliders.indexOf(collider);
        if (index < 0)
            return;
        this._colliders.splice(index, 1);
    }
    getColliders() {
        return this._colliders.slice(0);
    }
}






class PercentageDrag {
    constructor(dragPercentage) {
        this._dragPercentage = 0.15;
        this._dragPercentage = dragPercentage;
    }
    getDrag(velocityX, velocityY) {
        return {
            dragX: velocityX * this._dragPercentage,
            dragY: velocityY * this._dragPercentage
        };
    }
}

class PhysicsSpace {
    constructor(loop, collisions) {
        // private _rigidbodies: IRigidbody[] = [];
        this._actors = [];
        // super();
        loop.onUpdate.add(this.update, this);
        this._collisionSpaces = collisions;
    }
    get physicsActors() { return this._actors; }
    ;
    update(deltaTime) {
        this._actors.forEach((actor) => {
            this._collisionSpaces.forEach(space => {
                actor.checkCollision(space.colliders);
            });
        });
    }
    addPhysicsActor(actor) {
        let index = this._actors.indexOf(actor);
        if (index < 0) {
            this._actors.push(actor);
        }
    }
    removePhysicsActor(actor) {
        let index = this._actors.indexOf(actor);
        if (index < 0)
            return;
        this._actors.splice(index, 1);
    }
}

class PointRigidBody {
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

function rayToLine(x0, y0, lean, length) {
    // Using Pythagoras theorem and substitution to get x position 
    let x1 = x0 + Math.sqrt(length * length / (lean * lean + 1));
    let y1 = y0 + (x1 - x0) * lean;
    return { x1: x0, y1: y0, x2: x1, y2: y1 };
}
function lineToRay(x1, y1, x2, y2) {
    let dx = (x2 - x1);
    let dy = (y2 - y1);
    return {
        x0: x1,
        y0: y1,
        lean: dy / dx,
        length: Math.sqrt(dx * dx + dy * dy)
    };
}
class RayRender {
    constructor(layer, x0, y0, lean, length = 1, color = 'black', duration = 100) {
        this._onDestroy = new Action();
        let line = rayToLine(x0, y0, lean, length);
        this._x1 = line.x1;
        this._y1 = line.y1;
        this._x2 = line.x2;
        this._y2 = line.y2;
        this._color = color;
        layer.addRenderable(this);
        this._onDestroy.add(() => layer.removeRenderable(this), this);
        setTimeout(() => this.destroy.call(this), duration);
    }
    get onDestroy() { return this._onDestroy; }
    destroy() { this._onDestroy.invoke(); }
    render(context) {
        context.strokeStyle = this._color;
        context.moveTo(this._x1, this._y1);
        context.lineTo(this._x2, this._y2);
        context.stroke();
    }
}

class Rigidbody {
    constructor(transform) {
        this.dragEnabled = true;
        this._velocity = { x: 0, y: 0 };
        this._onDestroy = new Action();
        this._onCollisionEnter = new Action();
        this._onCollisionExit = new Action();
        this._onCollisionStay = new Action();
        this._transform = transform;
        this._previousX = transform.x;
        this._previousY = transform.y;
        this._drag = new PercentageDrag(5);
    }
    set velocity(value) { this._velocity = value; }
    get velocity() { return this._velocity; }
    get onCollisionEnter() { return this._onCollisionEnter; }
    get onCollisionExit() { return this._onCollisionExit; }
    get onCollisionStay() { return this._onCollisionStay; }
    get onDestroy() { return this._onDestroy; }
    get entity() { return this._transform; }
    update(deltaTime) {
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
        if (this._collider == null)
            return;
        colliders.forEach(collider => {
            if (collider == this._collider)
                return;
            var nearestPoint = this._collider.getNearestCorner(collider.centre.x, collider.centre.y);
            if (collider.overlapsPoint(nearestPoint.x, nearestPoint.y)) {
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


class VisibleBoxCollider {
    constructor(posX, posY, width, height, renderSpace, collisionSpace, color = 'black', fill = false) {
        this._entity = new Entity(posX, posY);
        this._collider = new BoxCollider(this._entity, width, height);
        this._visual = new BoxColliderRenderer(this._collider, color, fill);
        this._entity.addComponent(this._collider, Type.boxCollider);
        this._collider.onDestroy.add(this._visual.destroy, this._visual);
        renderSpace.addRenderable(this._visual);
        collisionSpace.addCollider(this._collider);
    }
    set outlineOnly(value) { this._visual.outlineOnly = value; }
    get entity() { return this._entity; }
    get collider() { return this._collider; }
}

class VisibleSphereCollider {
    constructor(posX, posY, width, height, renderSpace, collisionSpace, color = 'black', fill = false) {
        this._entity = new Entity(posX, posY);
        this._collider = new BoxCollider(this._entity, width, height);
        this._visual = new BoxColliderRenderer(this._collider, color, fill);
        this._entity.addComponent(this._collider, Type.sphereCollider);
        this._collider.onDestroy.add(this._visual.destroy, this._visual);
        renderSpace.addRenderable(this._visual);
        collisionSpace.addCollider(this._collider);
    }
    set outlineOnly(value) { this._visual.outlineOnly = value; }
    get entity() { return this._entity; }
    get collider() { return this._collider; }
}

class BoxColliderRenderer {
    constructor(collider, color = 'black', fill = false) {
        this._onDestroy = new Action();
        this._shouldFill = fill;
        this._collider = collider;
        this._color = color;
    }
    get onDestroy() { return this._onDestroy; }
    set outlineOnly(value) { this._shouldFill = !value; }
    render(context, viewX, viewY) {
        context.beginPath();
        let contextColor = context.fillStyle;
        let left = this._collider.left - viewX;
        let right = this._collider.right - viewX;
        let top = this._collider.top - viewY;
        let bottom = this._collider.bottom - viewY;
        context.fillStyle = this._color;
        context.strokeStyle = this._color;
        if (this._shouldFill) {
            this.renderFill(context, left, right, top, bottom);
        }
        else {
            this.renderOutline(context, left, right, top, bottom);
        }
        // context.fillStyle = contextColor;
        // context.strokeStyle = contextColor;
    }
    destroy() {
        this._onDestroy.invoke();
    }
    renderOutline(context, left, right, top, bottom) {
        context.moveTo(left, top);
        context.lineTo(right, top);
        context.lineTo(right, bottom);
        context.lineTo(left, bottom);
        context.closePath();
        context.stroke();
    }
    renderFill(context, left, right, top, bottom) {
        let width = Math.abs(right - left);
        let height = Math.abs(bottom - top);
        context.fillRect(left, top, width, height);
    }
}

class Camera {
    constructor(layers, transform, loop) {
        this._backgroundColor = "gray";
        this._mousePosition = { x: 0, y: 0 };
        this._onDestroy = new Action();
        this._transform = transform;
        this._layers = layers;
        loop.onUpdate.add(this.render, this);
        onMouseMoved.add(this.storeMousePosition, this);
    }
    get onDestroy() { return this._onDestroy; }
    ;
    get centreX() { return this._transform.worldX; }
    get centreY() { return this._transform.worldY; }
    get canvas() { return this._canvas; }
    get viewFrustum() {
        return new Rect(this.centreX - this.canvas.width * 0.5, this.centreY - this.canvas.height * 0.5, this.canvas.width, this.canvas.height);
    }
    get screenBounds() {
        let rect = this.canvas.getBoundingClientRect();
        let left = rect.left;
        let top = rect.top;
        let right = left + this.canvas.width;
        let bottom = top + this.canvas.height;
        return new Rect(left, top, right - left, bottom - top);
    }
    destroy() {
        this._canvas.remove();
    }
    setCanvas(canvas) {
        this._canvas = canvas;
        this._context = canvas.getContext("2d");
    }
    printCanvasProperties() {
        console.log("Camera canvas properties:");
        console.log("Width/Height: ", this.canvas.width, "/", this.canvas.height);
        console.log("Left/Top: ", this.canvas.style.left, "/", this.canvas.style.top);
        console.log("Positioning: ", this.canvas.style.position);
        console.log(this.canvas);
    }
    render() {
        this.paintBackground();
        for (let n = 0; n < this._layers.length; n++) {
            let offsetX = this._transform.worldX - this.canvas.width * 0.5;
            let offsetY = this._transform.worldY - this.canvas.height * 0.5;
            this._layers[n].render(this._context, offsetX, offsetY, this.viewFrustum);
        }
    }
    setBackgroundColor(color) {
        this._backgroundColor = color;
    }
    getMouseWorldPosition() {
        let cameraWorldRect = this.viewFrustum;
        let mouseCanvasPosition = this.getMouseCanvasPosition();
        let mouseWorldX = mouseCanvasPosition.x + cameraWorldRect.left;
        let mouseWorldY = mouseCanvasPosition.y + cameraWorldRect.top;
        return {
            x: mouseWorldX,
            y: mouseWorldY
        };
    }
    static createCanvas(screenLeft, screenTop, width, height, positioning) {
        let canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = canvas.height = height;
        canvas.style.position = positioning;
        canvas.width = width;
        canvas.height = height;
        canvas.style.left = screenLeft.toString() + "px";
        canvas.style.top = screenTop.toString() + "px";
        return (canvas);
    }
    getMouseCanvasPosition() {
        let cameraScreenRect = this.screenBounds;
        let mouseCanvasX = this._mousePosition.x - cameraScreenRect.left;
        let mouseCanvasY = this._mousePosition.y - cameraScreenRect.top;
        return {
            x: mouseCanvasX,
            y: mouseCanvasY
        };
    }
    storeMousePosition(event) {
        this._mousePosition = { x: event.x, y: event.y };
    }
    paintBackground() {
        let wipe = () => {
            let screenBounds = this.screenBounds;
            this._context.clearRect(screenBounds.left, screenBounds.top, this.canvas.width, this.canvas.height);
        };
        wipe();
        this._context.fillStyle = this._backgroundColor;
        this._context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

class CircleRenderer {
    constructor(radius, transform, color = 'black', startAngle = 0, endAngle = 2 * Math.PI, clockwise = false) {
        this._onDestroy = new Action();
        this._radius = radius;
        this._transform = transform;
        this._startAngle = startAngle;
        this._endAngle = endAngle;
        this._clockWise = clockwise;
        this._color = color;
    }
    get onDestroy() { return this._onDestroy; }
    render(context, viewX, viewY) {
        context.beginPath();
        context.fillStyle = this._color;
        context.strokeStyle = this._color;
        let centreX = this._transform.worldX - viewX;
        let centreY = this._transform.worldY - viewY;
        context.arc(centreX, centreY, this._radius, this._startAngle, this._endAngle, !this._clockWise);
        context.stroke();
    }
    destroy() {
        this._onDestroy.invoke();
    }
}



class RenderLayer {
    constructor(label = "background") {
        this._renderables = [];
    }
    addRenderable(renderable) {
        this._renderables.push(renderable);
    }
    removeRenderable(renderable) {
        let index = this._renderables.indexOf(renderable);
        if (index == -1)
            return;
        this._renderables.splice(index, 1);
    }
    render(context, offsetX, offsetY, viewRect) {
        this._renderables.forEach((renderable) => {
            renderable.render(context, offsetX, offsetY);
        });
    }
}

class RotatedSprite extends Sprite {
    get rotation() { return this._transform.rotation; }
    render(context, viewX, viewY) {
        let translationX = this.translation.x - viewX;
        let translationY = this.translation.y - viewY;
        let contextSettings = {
            contextAlpha: context.globalAlpha,
            translation: { x: translationX, y: translationY },
            rotation: -this.rotation,
            apply: function () {
                context.globalAlpha = this._alpha;
                context.translate(contextSettings.translation.x, contextSettings.translation.y);
                context.rotate(contextSettings.rotation);
            },
            reset: function () {
                context.globalAlpha = contextSettings.contextAlpha;
                context.rotate(-contextSettings.rotation);
                context.translate(-contextSettings.translation.x, -contextSettings.translation.y);
            }
        };
        contextSettings.apply();
        this.drawSprite(context);
        contextSettings.reset();
    }
}

class Sprite {
    constructor(transform, spriteId = "") {
        this._alpha = 1;
        this._offsetX = 0;
        this._offsetY = 0;
        this._onDestroy = new Action();
        this._spriteId = spriteId;
        this._image = document.getElementById(spriteId);
        if (this._image != null) {
            this._width = this._image.naturalWidth;
            this._height = this._image.naturalHeight;
            this._crop = {
                width: this._width,
                height: this._height,
                offsetX: 0,
                offsetY: 0
            };
        }
        else {
            console.log("Warning: Sprite component with sprite id", spriteId, "failed to find an image.");
        }
        this._transform = transform;
    }
    set alpha(value) { this._alpha = value; }
    get alpha() { return this._alpha; }
    set spriteId(value) {
        if (this._spriteId == value)
            return;
        this._spriteId = value;
        this._image = document.getElementById(this._spriteId);
    }
    set offsetX(value) { this._offsetX = value; }
    set offsetY(value) { this._offsetY = value; }
    get spriteId() { return this._spriteId; }
    get onDestroy() { return this._onDestroy; }
    get width() { return this._width; }
    set width(value) { this._width = value; }
    get height() { return this._width; }
    set height(value) { this._height = value; }
    get Transform() { return this._transform; }
    destroy() {
        this._onDestroy.invoke();
    }
    render(context, viewX, viewY) {
        if (this._image == null)
            return;
        let translationX = this.translation.x - viewX;
        let translationY = this.translation.y - viewY;
        let contextSettings = {
            contextAlpha: context.globalAlpha,
            translation: { x: translationX, y: translationY },
            apply: function () {
                context.globalAlpha = this._alpha;
                context.translate(contextSettings.translation.x, contextSettings.translation.y);
            },
            reset: function () {
                context.globalAlpha = contextSettings.contextAlpha;
                context.translate(-contextSettings.translation.x, -contextSettings.translation.y);
            }
        };
        contextSettings.apply();
        this.drawSprite(context);
        contextSettings.reset();
    }
    drawSprite(context) {
        context.drawImage(this._image, this._crop.offsetX, this._crop.offsetY, this._crop.width, this._crop.height, this._offsetX, this._offsetY, this._width, this._height);
    }
    get translation() {
        return {
            x: this._transform.worldX,
            y: this._transform.worldY
        };
    }
}

class TiledBackground {
    constructor(horizontalTileCount, verticalTileCount, spriteId = "") {
        this.onDestroy = new Action();
        this._tileCount = { x: horizontalTileCount, y: verticalTileCount };
        this._spriteId = spriteId;
        this._image = document.getElementById(spriteId);
        this._tileSize = this.getTileSize(this._image);
    }
    render(renderContext, viewX, viewY) {
        // console.log("Rendering background tile at", viewX, viewY);
        for (let x = 0; x < this._tileCount.x; x++) {
            for (let y = 0; y < this._tileCount.y; y++) {
                let offsetX = x * this._tileSize.x - viewX;
                let offsetY = y * this._tileSize.y - viewY;
                this.renderTile(renderContext, offsetX, offsetY);
            }
        }
    }
    getTileSize(image) {
        return { x: image.width, y: image.height };
    }
    renderTile(context, offsetX, offsetY) {
        context.drawImage(this._image, offsetX, offsetY);
    }
    destroy() {
    }
}

class BoxButton {
    constructor(renderSpace, collisionSpace, left, top, width, height, normalSprite = "", hoverSprite = "", pressSprite = "") {
        this._state = BoxButton._buttonStates.passive;
        this._onClick = new Action();
        this.onDestroy = new Action();
        this._spritesIds = {
            normal: normalSprite,
            hover: hoverSprite,
            press: pressSprite
        };
        this._entity = new Entity(left, top);
        this._sprite = new Sprite(this._entity, normalSprite);
        this._collider = new BoxCollider(this._entity, width, height);
        collisionSpace.addCollider(this._collider);
        this._sprite.width = width;
        this._sprite.height = height;
        // this._sprAddRenderComponenth * 0.5;
        // this._sprite.offsetY = height * 0.5;
        renderSpace.addRenderable(this._sprite);
        this._entity.addComponent(this._sprite, Type.sprite);
        this._entity.addComponent(this._collider, Type.boxCollider);
    }
    get collider() { return this._collider; }
    get onClick() { return this._onClick; }
    destroy() {
        this._entity.destroy();
    }
    press() {
        if (this._state == BoxButton._buttonStates.pressed)
            return;
        this._state = BoxButton._buttonStates.pressed;
        this.updateSprite();
    }
    release(mouseX = -2000, mouseY = -2000) {
        if (this._state != BoxButton._buttonStates.pressed)
            return;
        if (this._collider.overlapsPoint(mouseX, mouseY)) {
            this._onClick.invoke();
            this._state = BoxButton._buttonStates.hovered;
            this.updateSprite();
            return;
        }
        this._state = BoxButton._buttonStates.passive;
        this.updateSprite();
    }
    hover() {
        if (this._state == BoxButton._buttonStates.pressed ||
            this._state == BoxButton._buttonStates.hovered)
            return;
        this._state = BoxButton._buttonStates.hovered;
        this.updateSprite();
    }
    stopHover() {
        if (this._state == BoxButton._buttonStates.passive ||
            this._state == BoxButton._buttonStates.pressed)
            return;
        this._state = BoxButton._buttonStates.passive;
        this.updateSprite();
    }
    updateSprite() {
        switch (this._state) {
            case BoxButton._buttonStates.pressed:
                this._sprite.spriteId = this._spritesIds.press;
                break;
            case BoxButton._buttonStates.hovered:
                this._sprite.spriteId = this._spritesIds.hover;
                break;
            default:
                this._sprite.spriteId = this._spritesIds.normal;
                break;
        }
    }
}
BoxButton._buttonStates = {
    passive: 0,
    hovered: 1,
    pressed: 2
};

class KeyboardInput {
    constructor() {
        this._boundActions = Object.create(null);
        document.addEventListener("keydown", event => this.checkKeyboardInput.call(this, event));
    }
    bindKeyAction(action, key, doubleCase = true) {
        if (key.length == 0)
            return;
        key = key[0];
        let keyCode = this.getUniCode(key);
        if (!(keyCode in this._boundActions)) {
            this._boundActions[keyCode.toString()] = [];
        }
        this._boundActions[keyCode.toString()].push(() => action.invoke.call(action));
        if (doubleCase)
            this.bindOtherCase(action, key);
    }
    bindOtherCase(action, key) {
        // TODO: Get opposite case key and call bindKeyAction for it.
        let otherCase = key.toUpperCase();
        if (otherCase == key)
            otherCase = key.toLowerCase();
        if (otherCase == key)
            return;
        this.bindKeyAction(action, otherCase, false);
    }
    checkKeyboardInput(inputEvent) {
        let keyString = this.getUniCode(inputEvent.key).toString();
        let actions = this._boundActions[keyString];
        if (actions == undefined)
            return;
        actions.forEach(action => action());
    }
    getUniCode(char) {
        return char.charCodeAt(0);
    }
}

class MouseInput {
    constructor() {
        this._onMouseMove = new Action();
        this._onMouseDown = new Action();
        this._onMouseUp = new Action();
        document.addEventListener("mousemove", (event) => this.moveMouse.call(this, event));
        document.addEventListener("mousedown", (event) => this.mouseDown.call(this, event));
        document.addEventListener("mouseup", (event) => this.mouseUp.call(this, event));
    }
    get onMouseMove() { return this._onMouseMove; }
    get onMouseDown() { return this._onMouseDown; }
    get onMouseUp() { return this._onMouseUp; }
    moveMouse(event) {
        this._onMouseMove.invoke.call(this._onMouseMove, event);
    }
    mouseDown(event) {
        this._onMouseDown.invoke.call(this._onMouseDown, event);
    }
    mouseUp(event) {
        this._onMouseUp.invoke.call(this._onMouseUp, event);
    }
}

class MousePointer {
    constructor(mouseInput, loop, physicsSpace) {
        this._mouseX = 0;
        this._mouseY = 0;
        this._mouseWasPressed = false;
        this._mouseWasReleased = false;
        this._buttonMap = new Map();
        this._onDestroy = new Action();
        let mouseDownId = mouseInput.onMouseDown.add(() => {
            this._mouseWasPressed = true;
            loop.update();
            this._mouseWasPressed = false;
        }, this);
        let mouseUpId = mouseInput.onMouseUp.add(() => {
            this._mouseWasReleased = true;
            loop.update();
            this._mouseWasReleased = false;
        }, this);
        let mouseMoveId = mouseInput.onMouseMove.add((event) => {
            this._mouseX = event.clientX;
            this._mouseY = event.clientY;
            loop.update();
        }, this);
        this._onDestroy.add(() => mouseInput.onMouseDown.remove(mouseDownId), this);
        this._onDestroy.add(() => mouseInput.onMouseUp.remove(mouseUpId), this);
        this._onDestroy.add(() => mouseInput.onMouseMove.remove(mouseMoveId), this);
    }
    get onDestroy() { return this._onDestroy; }
    get onCollisionEnter() { return null; }
    get onCollisionExit() { return null; }
    get onCollisionStay() { return null; }
    destroy() {
        this._onDestroy.invoke();
    }
    addButton(button) {
        this._buttonMap.set(button.collider, button);
    }
    checkCollision(colliders) {
        colliders.forEach(collider => {
            let button = this._buttonMap.get(collider);
            if (button != undefined) {
                if (this._mouseWasReleased) {
                    button.release(this._mouseX, this._mouseY);
                }
                if (collider.overlapsPoint(this._mouseX, this._mouseY)) {
                    if (this._mouseWasPressed) {
                        button.press();
                    }
                    else {
                        button.hover();
                    }
                }
                else {
                    button.stopHover();
                }
            }
        });
    }
}

class UiLoop {
    constructor(input) {
        this._active = true;
        this._onUpdate = new Action();
        input.onMouseMove.add(this.update, this);
        input.onMouseDown.add(this.lateUpdate, this);
        input.onMouseUp.add(this.lateUpdate, this);
    }
    get ticksPerSecond() { return -1; }
    get onUpdate() { return this._onUpdate; }
    get playing() { return this._active; }
    pause() { this._active = false; }
    play() { this._active = true; }
    update() {
        if (!this._active)
            return;
        this._onUpdate.invoke();
    }
    lateUpdate() {
        setTimeout(this.update.call(this), 20);
    }
}

class UiSpace {
    constructor(renderSpace, renderLayer = -1000, mouseInput, keyboarInput = null) {
        this._renderer = renderSpace;
        this._loop = new UiLoop(mouseInput);
        this._collisionSpace = new CollisionSpace();
        this._mousePointer = new MousePointer(mouseInput, this._loop, this._physics);
    }
    createButton(leftPos, topPos, width, height, normalSprite = "", hoverSprite = "", pressSprite = "") {
        let button = new BoxButton(this._renderer, this._collisionSpace, leftPos, topPos, width, height, normalSprite, hoverSprite, pressSprite);
        this._mousePointer.addButton(button);
        return button;
    }
}

