let movementInput: CapricaMovementInput;
let gameData: {
  playLoop: Loop,
  renderLayers: IRenderLayer[],
  physics: PhysicsSpace,
  mainCharacter: CapricaMainCharacter,
  lookController: CapricaLookController
}

function capricaStart() {
  let loop = new Loop(60);
  let renderLayers: IRenderLayer[] = createRenderLayers();
  let physicsSpace = new PhysicsSpace(loop);
  let cameraTransform = new Transform(50, 50);
  let camera = createCamera(renderLayers, cameraTransform, loop);
  let mainCharacter = new CapricaMainCharacter(50, 50, loop, renderLayers[1], camera,  physicsSpace)
  cameraTransform.parent = mainCharacter.entity.transform;
  movementInput = mainCharacter.input;
  let lookController = new CapricaLookController(onMouseMoved, mainCharacter);
  gameData = {
    playLoop: loop,
    renderLayers: renderLayers,
    physics: physicsSpace,
    mainCharacter: mainCharacter,
    lookController: lookController
  };

  runDevTests();
  console.log(cameraTransform.parent);
  console.log("Caprica Started");
}

function createCamera(renderLayers:IRenderLayer[], transform:ITransform, loop:ILoop):Camera {
  let camera = new Camera(renderLayers, transform, loop);
  let canvas = camera.createCanvas(10, 10, 800, 600);
  camera.addToDocument();
  return camera;
}

function createRenderLayers(): IRenderLayer[] {
  return [
    new RenderLayer(),
    new RenderLayer()
  ];
}

function runDevTests() {
  createTiledBackground();
}

function checkInputPressed(event: KeyboardEvent) {
  movementInput.CheckPressed(event);
}

function checkInputReleased(event: KeyboardEvent) {
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