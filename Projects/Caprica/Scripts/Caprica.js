class CapricaLookController {
    constructor(camera, character) {
        this._entity = character.entity;
        this._camera = camera;
    }
    updateRotation() {
        this._entity.transform.rotation = this.getLookRotation();
    }
    getLookRotation() {
        let entityX = this._entity.transform.worldX;
        let entityY = this._entity.transform.worldY;
        let mouse = this._camera.getMouseWorldPosition();
        // console.log(mouse);
        // this._camera.printCanvasProperties();
        let right = vector.right;
        let entityToMouseX = mouse.x - entityX;
        let entityToMouseY = mouse.y - entityY;
        return algebra.angleFromToCounterClockwise(right.x, right.y, entityToMouseX, -entityToMouseY);
    }
    logMousePosition(x, y) {
        console.log("Mouse position:", x, ", ", y);
    }
    logMouseAngle(mouseX, mouseY) {
        let right = vector.right;
        let angle = algebra.angleBetween(right.x, -right.y, mouseX, -mouseY);
        console.log("Mouse Angle:", angle, "radians");
    }
    logMouseRotation(mouseX, mouseY) {
        let right = vector.right;
        let offsetX = mouseX - 100;
        let offsetY = mouseY - 100;
        let angle = algebra.angleFromToCounterClockwise(right.x, right.y, offsetX, -offsetY);
        console.log("Mouse Rotation:", angle, "radians");
    }
}

class CapricaMainCharacterSprite {
    constructor(loop, legLayer, armLayer, torsoLayer, movementController) {
        this._walkCycleTime = 0.25;
        this._timeSinceLastStep = 0;
        this._legsVisible = false;
        this._legLayer = legLayer;
        this._armLayer = armLayer;
        this._torsoLayer = torsoLayer;
        this._loop = loop;
        loop.onUpdate.add(this.update, this);
        this._movementController = movementController;
    }
    get moving() { return this._movementController.moving; }
    withLegs(walk1, walk2) {
        walk1.offsetX = -32;
        walk1.offsetY = -32;
        walk2.offsetX = -32;
        walk2.offsetY = -32;
        this._legWalk1 = walk1;
        this._legWalk2 = walk2;
        this._currentLegSprite = this._legWalk1;
        this._legLayer.addRenderable(this._currentLegSprite);
        return this;
    }
    withTorso(torso) {
        torso.offsetX = -32;
        torso.offsetY = -32;
        this._torso = torso;
        this._torsoLayer.addRenderable(this._torso);
        return this;
    }
    withArms(armsDown, armsAiming) {
        armsDown.offsetX = -32;
        armsDown.offsetY = -32;
        armsAiming.offsetX = -32;
        armsAiming.offsetY = -32;
        this._armsDown = armsDown;
        this._armsAiming = armsAiming;
        this._armLayer.addRenderable(this._armsDown);
        return this;
    }
    startAim() {
        this._armLayer.removeRenderable(this._armsDown);
        this._armLayer.addRenderable(this._armsAiming);
    }
    endAim() {
        this._armLayer.removeRenderable(this._armsAiming);
        this._armLayer.addRenderable(this._armsDown);
    }
    update(deltaTime) {
        if (!this.moving) {
            this.hideLegs();
            return;
        }
        this._timeSinceLastStep += deltaTime;
        if (this._timeSinceLastStep > this._walkCycleTime) {
            this._timeSinceLastStep = 0;
            this.swapLegs();
        }
        // console.log("Time since last step: ", this._timeSinceLastStep);
    }
    swapLegs() {
        this._legLayer.removeRenderable(this._currentLegSprite);
        if (this._currentLegSprite == this._legWalk1) {
            this._currentLegSprite = this._legWalk2;
        }
        else {
            this._currentLegSprite = this._legWalk1;
        }
        this._legLayer.addRenderable(this._currentLegSprite);
    }
    hideLegs() {
        if (this._currentLegSprite == null)
            return;
        this._legLayer.removeRenderable(this._currentLegSprite);
        this._currentLegSprite = null;
        // this._legsVisible = false;
    }
    showLegs() {
        if (this._legsVisible)
            return;
        this._legLayer.addRenderable(this._currentLegSprite);
        this._legsVisible = true;
    }
}

class CapricaMovementController {
    constructor(input, character) {
        this._inputX = 0;
        this._inputY = 0;
        this._accelleration = 5000;
        this._maxSpeed = 250;
        this._minimumSpeed = 50;
        this._dragProfile = new PercentageDrag(15);
        this.initialiseInput(input);
        this._character = character;
    }
    get moving() {
        let velocity = this._character.rigidbody.velocity;
        let velocityAddedMagnitude = Math.abs(velocity.x) + Math.abs(velocity.y);
        return velocityAddedMagnitude > 50;
    }
    get inputX() { return this._inputX; }
    set inputX(value) {
        this._inputX = value;
        if (this._inputX > 1)
            this._inputX = 1;
        else if (this._inputX < -1)
            this._inputX = -1;
    }
    get inputY() { return this._inputY; }
    set inputY(value) {
        this._inputY = value;
        if (this._inputY > 1)
            this._inputY = 1;
        else if (this._inputY < -1)
            this._inputY = -1;
    }
    update(deltaSeconds) {
        let impulseX = this._accelleration * deltaSeconds * this._inputX;
        let impulseY = this._accelleration * deltaSeconds * this._inputY;
        let lastVelocity = this._character.rigidbody.velocity;
        let velocity = {
            x: this.clampMaxSpeed(lastVelocity.x + impulseX),
            y: this.clampMaxSpeed(lastVelocity.y + impulseY)
        };
        velocity = this.applyDrag(velocity.x, velocity.y, deltaSeconds);
        // velocity.x = this.ClampMinSpeed(velocity.x);
        // velocity.y = this.ClampMaxSpeed(velocity.y);
        this._character.rigidbody.velocity = velocity;
    }
    clampMaxSpeed(speed) {
        if (speed > this._maxSpeed) {
            speed = this._maxSpeed;
        }
        else if (speed < -this._maxSpeed) {
            speed = -this._maxSpeed;
        }
        return speed;
    }
    clampMinSpeed(speed) {
        if (Math.abs(speed) < this._minimumSpeed)
            return 0;
        return speed;
    }
    applyDrag(velocityX, velocityY, deltaSeconds) {
        let drag = this._dragProfile.getDrag(velocityX, velocityY);
        if (this._inputX == 0) {
            velocityX -= drag.dragX * deltaSeconds;
        }
        if (this._inputY == 0) {
            velocityY -= drag.dragY * deltaSeconds;
        }
        return {
            x: velocityX,
            y: velocityY
        };
    }
    initialiseInput(input) {
        input.Up.onPressed.add(addInputUp, this);
        input.Right.onPressed.add(addInputRight, this);
        input.Down.onPressed.add(addInputDown, this);
        input.Left.onPressed.add(addInputLeft, this);
        input.Up.onReleased.add(addInputDown, this);
        input.Right.onReleased.add(addInputLeft, this);
        input.Down.onReleased.add(addInputUp, this);
        input.Left.onReleased.add(addInputRight, this);
        function addInputUp() { this.inputY -= 1; }
        function addInputDown() { this.inputY += 1; }
        function addInputRight() { this.inputX += 1; }
        function addInputLeft() { this.inputX -= 1; }
    }
}

class CapricaMovementInput {
    constructor() {
        this._upBinding = new Binding("KeyW");
        this._rightBinding = new Binding("KeyD");
        this._downBinding = new Binding("KeyS");
        this._leftBinding = new Binding("KeyA");
    }
    get Up() { return this._upBinding; }
    get Right() { return this._rightBinding; }
    get Down() { return this._downBinding; }
    get Left() { return this._leftBinding; }
    CheckPressed(event) {
        this.Up.checkPressed(event);
        this.Right.checkPressed(event);
        this.Down.checkPressed(event);
        this.Left.checkPressed(event);
    }
    CheckReleased(event) {
        this.Up.checkReleased(event);
        this.Right.checkReleased(event);
        this.Down.checkReleased(event);
        this.Left.checkReleased(event);
    }
}

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

class ShakerMaker {
    constructor(targetTransform, targetLoop) {
        this._targetTransform = targetTransform;
        this._targetLoop = targetLoop;
    }
    MakeShake(numberOfShakes = 1, shakeOffsetMin = 5, shakeOffsetMax = 15) {
        let shakeRange = { min: shakeOffsetMin, max: shakeOffsetMax };
        return new Shaker(this._targetTransform, this._targetLoop, numberOfShakes, shakeRange);
    }
}
class Shaker {
    constructor(targetTransform, loop, numberOfShakes, shakeOffset) {
        this._offsetX = 0;
        this._offsetY = 0;
        this._targetTransform = targetTransform;
        this._loopActionId = loop.onUpdate.add(this.update, this);
        this._remainingShakes = numberOfShakes;
        this._minOffset = shakeOffset.min;
        this._maxOffset = shakeOffset.max;
        this._loop = loop;
    }
    update() {
        this.resetTargetToNormal();
        let shakeMagnitude = this._minOffset + Math.random() * (this._maxOffset - this._minOffset);
        this.applyShake(shakeMagnitude);
        this.addShakeCount();
    }
    resetTargetToNormal() {
        this._targetTransform.x -= this._offsetX;
        this._targetTransform.y -= this._offsetY;
    }
    applyShake(magnitude) {
        this._targetTransform.x += magnitude;
        this._targetTransform.y += magnitude;
        this._offsetX = magnitude;
        this._offsetY = magnitude;
    }
    addShakeCount() {
        if (--this._remainingShakes < 0) {
            this.resetTargetToNormal();
            this._loop.onUpdate.remove(this._loopActionId);
        }
    }
}

class WindowEvents {
    constructor() {
        this.onWindowResize = new Action();
        window.onresize = () => this.onWindowResize.invoke(window);
    }
}
const windowEvents = new WindowEvents();

// Dependencies: WindowEvents
let movementInput;
let gameData;
function capricaStart(canvasId) {
    let inputLoop = new Loop(60);
    let movementLoop = new Loop(60);
    let physicsLoop = new Loop(60);
    let renderLoop = new Loop(60);
    let renderLayers = createRenderLayers();
    let cameraTransform = new Transform(0, 0);
    let camera = createCamera(renderLayers, cameraTransform, renderLoop, canvasId);
    let collisionSpaces = [new CollisionSpace()];
    let physicsSpace = new PhysicsSpace(physicsLoop, collisionSpaces);
    let mainCharacter = new CapricaMainCharacter(0, 0, inputLoop, movementLoop, renderLayers[1], renderLayers[2], renderLayers[3], camera, physicsSpace);
    let gun = createGun(cameraTransform, movementLoop, mainCharacter.entity.transform, renderLayers[3], camera);
    let boxes = createTestBoxes(renderLayers[1], collisionSpaces[0]);
    let debugCircle = new CircleRenderer(100, mainCharacter.entity.transform, "black", 32);
    renderLayers[3].addRenderable(debugCircle);
    mainCharacter.assignGun(gun);
    cameraTransform.parent = mainCharacter.entity.transform;
    movementInput = mainCharacter.input;
    gameData = {
        playLoop: inputLoop,
        renderLayers: renderLayers,
        physics: physicsSpace,
        mainCharacter: mainCharacter,
        lookController: null
    };
    runDevTests();
    testEntityGetComponent();
    console.log("Caprica Started");
}
function createGun(cameraTransform, gameLoop, characterTransform, renderLayer, camera) {
    let aimConeRenderer = new AimConeRenderer(renderLayer, 300);
    let recoilCameraShaker = new ShakerMaker(cameraTransform, gameLoop);
    let aimController = new AimController(gameLoop, characterTransform, aimConeRenderer, camera, new AimData(Math.PI * 0.5, Math.PI * 0.15, 0.5));
    return new Gun(aimController, recoilCameraShaker);
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
function testEntityGetComponent() {
    var entity = new Entity();
    entity.addComponent(new BoxCollider(entity, 10, 10), Type.boxCollider);
    var collider = entity.getComponent(Type.boxCollider);
    console.log(collider);
}
function createRenderLayers() {
    return [
        new RenderLayer(),
        new RenderLayer(),
        new RenderLayer(),
        new RenderLayer() // Character Torso
    ];
}
function createLoops() {
    return [
        new Loop(),
        new Loop(),
        new Loop(),
        new Loop() // Rendering
    ];
}
function runDevTests() {
    createTiledBackground();
}
function checkInputPressed(event) {
    movementInput.CheckPressed(event);
}
function checkInputReleased(event) {
    movementInput.CheckReleased(event);
}
function createTiledBackground() {
    let renderSpace = gameData.renderLayers[0];
    let background = new TiledBackground(10, 10, "grass_tile");
    renderSpace.addRenderable(background);
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
/*
Canvas settings for disabling anti alisasing
https://stackoverflow.com/questions/7615009/disable-interpolation-when-scaling-a-canvas
canvas {
  image-rendering: optimizeSpeed;             // Older versions of FF
  image-rendering: -moz-crisp-edges;          // FF 6.0+
  image-rendering: -webkit-optimize-contrast; // Safari
  image-rendering: -o-crisp-edges;            // OS X & Windows Opera (12.02+)
  image-rendering: pixelated;                 // Awesome future-browsers (?)
  -ms-interpolation-mode: nearest-neighbor;   // IE
}
/**/ 

class AimConeRenderer {
    constructor(renderSpace, coneDistance = 100) {
        this._startPoint = { x: 0, y: 0 };
        this._viewPosition = { x: 0, y: 0 };
        this.coneAngle = Math.PI * 0.25;
        this.visible = false;
        this._onDestroy = new Action();
        renderSpace.addRenderable(this);
        this._coneDistance = coneDistance;
        this.setDirection(1, 0);
    }
    get onDestroy() { return this._onDestroy; }
    get startPoint() {
        return {
            x: this._startPoint.x - this._viewPosition.x,
            y: this._startPoint.y - this._viewPosition.y
        };
    }
    destroy() {
        this._onDestroy.invoke();
    }
    render(context, viewX, viewY) {
        if (!this.visible)
            return;
        this._viewPosition = { x: viewX, y: viewY };
        // context.strokeStyle = "#000000"; // Black
        // this.renderLookDirectionLine(context);
        context.strokeStyle = "#45f71b"; // Lime
        this.renderCone(context);
    }
    setDirection(x, y) {
        this._direction = algebra.normalize(x, y);
    }
    setStartPoint(x, y) {
        this._startPoint.x = x;
        this._startPoint.y = y;
    }
    getConeMiddleTip() {
        let startX = this.startPoint.x;
        let startY = this.startPoint.y;
        return {
            x: startX + this._direction.x * this._coneDistance,
            y: startY + this._direction.y * this._coneDistance
        };
    }
    renderLookDirectionLine(context) {
        let destination = this.getConeMiddleTip();
        context.beginPath();
        context.moveTo(this.startPoint.x, this.startPoint.y);
        context.lineTo(destination.x, destination.y);
        context.stroke();
    }
    renderCone(context) {
        let coneDirectionX = this._direction.x * this._coneDistance;
        let coneDirectionY = this._direction.y * this._coneDistance;
        let coneRight = algebra.rotate(coneDirectionX, coneDirectionY, -this.coneAngle * 0.5);
        let coneLeft = algebra.rotate(coneDirectionX, coneDirectionY, this.coneAngle * 0.5);
        let coneTipRight = vector.add(this.startPoint, coneRight);
        let coneTipLeft = vector.add(this.startPoint, coneLeft);
        this.renderLine(this.startPoint.x, this.startPoint.y, coneTipLeft.x, coneTipLeft.y, context);
        this.renderLine(this.startPoint.x, this.startPoint.y, coneTipRight.x, coneTipRight.y, context);
    }
    renderLine(x0, y0, x1, y1, context) {
        context.beginPath();
        context.moveTo(x0, y0);
        context.lineTo(x1, y1);
        context.stroke();
    }
}

class AimController {
    constructor(loop, characterTransform, cone, camera, aimData) {
        this._aimTime = 0;
        this._mouseX = 0;
        this._mouseY = 0;
        this._aiming = false;
        // onMouseDown.add(this.steady, this);
        // onMouseUp.add(this.release, this);
        onMouseMoved.add(this.updateMousePosition, this);
        this._loop = loop;
        this._cone = cone;
        this._transform = characterTransform;
        this._aimData = aimData;
        this._camera = camera;
    }
    set aimData(value) {
        if (value == null)
            return;
        this._aimData = value;
        this.endAim();
    }
    steady(event) {
        if (event.button != 0)
            return;
        this.startAim();
    }
    release(event) {
        this.endAim();
    }
    updateMousePosition(event) {
        this._mouseX = event.x;
        this._mouseY = event.y;
    }
    startAim() {
        if (this._aiming)
            return;
        this._aimTime = 0;
        this._updateEventIndex = this._loop.onUpdate.add(this.update, this);
        this.updateAimDirection();
        this.updateAimAngle();
        this._cone.visible = true;
        this._aiming = true;
    }
    endAim() {
        if (!this._aiming)
            return;
        this._loop.onUpdate.remove(this._updateEventIndex);
        this._cone.visible = false;
        this._aiming = false;
    }
    getDirection() {
        let mouseWorldPosition = this._camera.getMouseWorldPosition();
        let positionX = this._transform.worldX;
        let positionY = this._transform.worldY;
        return {
            x: mouseWorldPosition.x - positionX,
            y: mouseWorldPosition.y - positionY
        };
    }
    update(deltaTime) {
        this._aimTime += deltaTime;
        this.updateAimDirection();
        this.updateAimAngle();
    }
    updateAimDirection() {
        let positionX = this._transform.worldX;
        let positionY = this._transform.worldY;
        let direction = this.getDirection();
        this._cone.setDirection(direction.x, direction.y);
        this._cone.setStartPoint(positionX, positionY);
    }
    updateAimAngle() {
        if (this.getAimPercent() > 1.0) {
            this._cone.coneAngle = this._aimData.aimEndAngle;
            return;
        }
        this._cone.coneAngle = this.getCurrentAimAngle();
    }
    getAimPercent() {
        return (this._aimTime / this._aimData.aimSeconds);
    }
    getCurrentAimAngle() {
        let baseAngle = this._aimData.aimStartAngle;
        let deltaAngle = baseAngle - this._aimData.aimEndAngle;
        return baseAngle - deltaAngle * this.getAimPercent();
    }
}

class AimData {
    constructor(startAngle, endAngle, durationInSeconds) {
        this.aimStartAngle = Math.PI;
        this.aimEndAngle = Math.PI * 0.33;
        this.aimSeconds = 1.0;
        this.aimStartAngle = startAngle;
        this.aimEndAngle = endAngle;
        this.aimSeconds = durationInSeconds;
    }
}

class CapricaMainCharacter {
    constructor(xPosition, yPosition, inputLoop, movementLoop, legRenderLayer, armRenderLayer, torsoRenderLayer, camera, physics) {
        this._entity = new Entity(xPosition, yPosition);
        this.initialiseMovementController(inputLoop);
        this.initialiseLookController(camera, inputLoop);
        this.initialisePhysics(this._entity, physics, movementLoop);
        this.generateSprites(movementLoop, this._entity.transform, legRenderLayer, armRenderLayer, torsoRenderLayer, this.controller);
    }
    get entity() { return this._entity; }
    get rigidbody() { return this._rigidbody; }
    get sprite() { return this._sprite; }
    get controller() { return this._movementController; }
    get input() { return this._input; }
    get gun() { return this._gun; }
    assignGun(gun) {
        this._gun = gun;
        gun.onTakeAim.add(this._sprite.startAim, this._sprite);
        gun.onStopAim.add(this._sprite.endAim, this._sprite);
    }
    initialisePhysics(entity, physics, movementLoop) {
        let rigidBody = new PointRigidBody(entity);
        rigidBody.dragEnabled = false;
        movementLoop.onUpdate.add(rigidBody.update, rigidBody);
        entity.addComponent(rigidBody, Type.pointRigidbody);
        this._rigidbody = rigidBody;
        // physics.addPhysicsActor(rigidBody);
    }
    initialiseMovementController(loop) {
        this._input = new CapricaMovementInput();
        this._movementController = new CapricaMovementController(this._input, this);
        loop.onUpdate.add(this._movementController.update, this._movementController);
    }
    initialiseLookController(camera, loop) {
        this._lookController = new CapricaLookController(camera, this);
        loop.onUpdate.add(this._lookController.updateRotation, this._lookController);
    }
    setupInputLog(input) {
        input.Up.onPressed.add(() => console.log("Up pressed, velocity: " + this._rigidbody.velocity.y), this);
        input.Up.onReleased.add(() => console.log("Up released"), this);
        input.Right.onPressed.add(() => console.log("Right pressed"), this);
        input.Down.onPressed.add(() => console.log("Down pressed"), this);
        input.Left.onPressed.add(() => console.log("Left pressed"), this);
    }
    generateSprites(loop, transform, renderLayerLegs, renderLayerArms, renderLayerTorso, movementController) {
        let ids = {
            legA: 'legsA',
            legB: 'legsB',
            armDown: 'armsDown',
            armUp: 'armsAim',
            torso: 'torso'
        };
        let legA = new RotatedSprite(transform, ids.legA);
        let legB = new RotatedSprite(transform, ids.legB);
        let armDown = new RotatedSprite(transform, ids.armDown);
        let armUp = new RotatedSprite(transform, ids.armUp);
        let torso = new RotatedSprite(transform, ids.torso);
        this._sprite = new CapricaMainCharacterSprite(loop, renderLayerLegs, renderLayerArms, renderLayerTorso, movementController)
            .withArms(armDown, armUp)
            .withLegs(legA, legB)
            .withTorso(torso);
    }
}

class Gun {
    constructor(aim, shakerMaker) {
        this._onFire = new Action();
        this._onTakeAim = new Action();
        this._onStopAim = new Action();
        this._aim = aim;
        this._shakerMaker = shakerMaker;
        onMouseDown.add(this.takeAim, this);
        onMouseUp.add(this.discharge, this);
        this._shootAudio = new AudioComponent("gunShoot");
        this._shootAudio.shouldLoop = false;
        this._takeAimAudio = new AudioComponent("aimStart");
        this._takeAimAudio.shouldLoop = false;
    }
    get onFire() { return this._onFire; }
    get onTakeAim() { return this._onTakeAim; }
    get onStopAim() { return this._onStopAim; }
    takeAim() {
        this._aim.startAim();
        this._onTakeAim.invoke();
        this._takeAimAudio.stopPlaying();
        this._takeAimAudio.play();
    }
    endAim() {
        this._aim.endAim();
        this._onStopAim.invoke();
    }
    discharge() {
        this.endAim();
        let offset = { min: 5, max: 15 };
        this._shakerMaker.MakeShake(1, 5, 15);
        this._shootAudio.stopPlaying();
        this._shootAudio.play();
        this._onFire.invoke();
    }
}

