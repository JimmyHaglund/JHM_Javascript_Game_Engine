let movementInput;
let gameData;
let viewCentre;
function capricaStart() {
    let loop = new Loop(60);
    let renderSpace = new RenderSpace(loop, 800, 600);
    let physicsSpace = new PhysicsSpace(loop);
    let mainCharacter = new CapricaMainCharacter(50, 50, loop, renderSpace, physicsSpace);
    renderSpace.viewTransform = mainCharacter.entity.transform;
    movementInput = mainCharacter.input;
    let lookController = new CapricaLookController(onMouseMoved, mainCharacter);
    viewCentre = renderSpace.viewCentre;
    gameData = {
        playLoop: loop,
        render: renderSpace,
        physics: physicsSpace,
        mainCharacter: mainCharacter,
        lookController: lookController
    };
    runDevTests();
    renderSpace.render();
    console.log("Caprica Started");
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
    let renderSpace = gameData.render;
    let background = new TiledBackground(10, 10, "grass_tile");
    renderSpace.addRenderComponent(background, 100);
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
