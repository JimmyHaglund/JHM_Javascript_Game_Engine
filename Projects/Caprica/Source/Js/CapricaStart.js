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
    let mainCharacter = new CapricaMainCharacter(150, 150, inputLoop, movementLoop, renderLayers[1], renderLayers[2], renderLayers[3], camera, physicsSpace);
    let gun = createGun(cameraTransform, movementLoop, mainCharacter.entity.transform, renderLayers[3], camera, physicsSpace);
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
function createGun(cameraTransform, gameLoop, characterTransform, renderLayer, camera, physics) {
    let aimConeRenderer = new AimConeRenderer(renderLayer, 300);
    let recoilCameraShaker = new ShakerMaker(cameraTransform, gameLoop);
    let aimController = new AimController(gameLoop, characterTransform, aimConeRenderer, camera, new AimData(Math.PI * 0.5, Math.PI * 0.15, 0.5));
    let bullet = new Bullet(0, 0, 'bullet', 10, renderLayer);
    physics.addPhysicsActor(bullet.rigidbody);
    gameLoop.onUpdate.add(bullet.rigidbody.update, bullet.rigidbody);
    return new Gun(aimController, recoilCameraShaker, bullet);
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
    for (let n = 0; n < amount; n++) {
        let x = n * width;
        let y = 0;
        let box = createSatBox(width);
        box.collider.entity.worldX = x;
        box.collider.entity.worldY = y;
        renderspace.addRenderable(box.renderer);
        collisionSpace.addCollider(box.collider);
        result.push(box.collider);
    }
    return result;
}
function createSatBox(size = 100, color = "black") {
    let entity = new Entity(0, 0);
    let vertices = [
        { x: -size * 0.5, y: -size * 0.5 },
        { x: -size * 0.5, y: size * 0.5 },
        { x: size * 0.5, y: size * 0.5 },
        { x: size * 0.5, y: -size * 0.5 }
    ];
    let result = new SatCollider(entity, 0, 0, vertices);
    let renderer = new SatColliderRenderer(result, "black", color);
    return { collider: result, renderer: renderer };
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
