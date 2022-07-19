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
    let rayCollisionRenderBox = createSatBox("green", 2);
    let nearestBoundingPointRenderBox = createSatBox("purple", 2);
    let nearestPointRenderBox = createSatBox("blue", 2);
    // let mousePhysics = new PointRigidBody(mouseCollider.entity);
    renderLayers[1].addRenderable(mouseBox.renderer);
    renderLayers[1].addRenderable(staticBox.renderer);
    renderLayers[1].addRenderable(collisionRenderBox.renderer);
    renderLayers[1].addRenderable(rayCollisionRenderBox.renderer);
    renderLayers[1].addRenderable(nearestBoundingPointRenderBox.renderer);
    renderLayers[1].addRenderable(nearestPointRenderBox.renderer);
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
    mainLoop.onUpdate.add(() => {
        let collisionData = mouseBox.collider.getCollision(staticBox.collider);
        if (collisionData == null)
            return;
        collisionRenderBox.collider.entity.worldX = collisionData.x;
        collisionRenderBox.collider.entity.worldY = collisionData.y;
        staticBox.collider.entity.worldX -= collisionData.normalX;
        staticBox.collider.entity.worldY -= collisionData.normalY;
    }, mouseBox);
    let ray = { x0: 0, y0: 0, x1: 600, y1: 600 };
    let rayRender = new RayRenderOffset(renderLayers[1], ray.x0, ray.y0, ray.x1, ray.y1, "green", 120000);
    onMouseDown.add(() => {
        showRayCollision(mouseBox.collider, rayCollisionRenderBox.collider.entity, ray);
        showNearestPoint(mouseBox.collider, nearestPointRenderBox.collider.entity);
        showNearestBoundingPoint(mouseBox.collider, nearestBoundingPointRenderBox.collider.entity);
    }, mouseBox);
}
function showRayCollision(mouseBox, rayEntity, ray) {
    console.log("Point (0, 0) is inside collider: ", mouseBox.overlapsPoint(0, 0));
    let collisions = mouseBox.getCollisionPointsWithRay(ray.x0, ray.y0, ray.x1, ray.y1);
    if (collisions.length == 0)
        return;
    rayEntity.x = collisions[0].x;
    rayEntity.y = collisions[0].y;
    console.log("Collisions: ", collisions.length, collisions);
}
function showNearestBoundingPoint(mouseBox, indicator) {
    let nearestPoint = mouseBox.getNearestBoundingPoint(0, 0);
    indicator.x = nearestPoint.x;
    indicator.y = nearestPoint.y;
    nearestPoint = mouseBox.getNearestPoint(0, 0);
}
function showNearestPoint(mouseBox, indicator) {
    let nearestPoint = mouseBox.getNearestPoint(0, 0);
    indicator.x = nearestPoint.x;
    indicator.y = nearestPoint.y;
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
function createSatBox(color = "black", size = 100) {
    let entity = new Entity(0, 0);
    let mod = size * 0.5;
    let vertices = [
        { x: -0.538 * mod, y: -0.638 * mod },
        { x: -0.923 * mod, y: -0.014 * mod },
        { x: -0.595 * mod, y: 0.857 * mod },
        { x: 0.504 * mod, y: 0.866 * mod },
        { x: 0.934 * mod, y: -0.008 * mod },
        { x: 0.415 * mod, y: -0.758 * mod },
    ];
    let result = new SatCollider(entity, 0, 0, vertices);
    let renderer = new SatColliderRenderer(result, "black", color);
    return { collider: result, renderer: renderer };
}
