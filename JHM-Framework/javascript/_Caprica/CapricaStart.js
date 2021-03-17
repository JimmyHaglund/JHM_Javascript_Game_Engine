let movementInput;
let gameData;
function capricaStart() {
    let gameLoop = new Loop(60);
    let renderLoop = new Loop(60);
    let renderLayers = createRenderLayers();
    let cameraTransform = new Transform(0, 0);
    let camera = createCamera(renderLayers, cameraTransform, renderLoop);
    let physicsSpace = new PhysicsSpace(gameLoop);
    let mainCharacter = new CapricaMainCharacter(0, 0, gameLoop, renderLayers[1], camera, physicsSpace);
    let aimConeRenderer = new AimConeRenderer(renderLayers[1], 300);
    let gunShaker = new ShakerMaker(cameraTransform, gameLoop);
    let aimController = new AimController(gameLoop, mainCharacter.entity.transform, aimConeRenderer, camera, new AimData(Math.PI * 0.5, Math.PI * 0.15, 0.5));
    let gun = new Gun(aimController, gunShaker);
    mainCharacter.assignGun(gun);
    cameraTransform.parent = mainCharacter.entity.transform;
    movementInput = mainCharacter.input;
    gameData = {
        playLoop: gameLoop,
        renderLayers: renderLayers,
        physics: physicsSpace,
        mainCharacter: mainCharacter,
        lookController: null
    };
    runDevTests();
    console.log("Caprica Started");
}
function generateShaker(transform) {
    let shakeDisplacement = { min: 5, max: 20 };
    let loop = gameData.playLoop;
    let shaker = new Shaker(transform, loop, 10, shakeDisplacement);
}
function createCamera(renderLayers, transform, loop, left = 10, top = 10, width = 800, height = 600) {
    let camera = new Camera(renderLayers, transform, loop);
    let canvas = camera.createCanvas(left, top, width, height);
    camera.addToDocument();
    return camera;
}
function createRenderLayers() {
    return [
        new RenderLayer(),
        new RenderLayer()
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
*/ 
