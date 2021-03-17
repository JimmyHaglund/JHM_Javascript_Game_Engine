let movementInput: CapricaMovementInput;
let gameData: {
  playLoop: Loop,
  renderLayers: IRenderLayer[],
  physics: PhysicsSpace,
  mainCharacter: CapricaMainCharacter,
  lookController: CapricaLookController
}

function capricaStart() {
  let gameLoop = new Loop(60);
  let renderLoop = new Loop(60);
  let renderLayers: IRenderLayer[] = createRenderLayers();
  let cameraTransform = new Transform(0, 0);
  let camera = createCamera(renderLayers, cameraTransform, renderLoop);
  let physicsSpace = new PhysicsSpace(gameLoop);
  let mainCharacter = new CapricaMainCharacter(0, 0, gameLoop, renderLayers[1], 
    renderLayers[2], renderLayers[3], camera, physicsSpace)
  let gun = createGun(cameraTransform, gameLoop, mainCharacter.entity.transform, renderLayers[3], camera);
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

function createGun(cameraTransform:Transform, gameLoop:Loop, 
  characterTransform:Transform, renderLayer:IRenderLayer, camera:Camera): Gun {
  let aimConeRenderer = new AimConeRenderer(renderLayer, 300);
  let recoilCameraShaker = new ShakerMaker(cameraTransform, gameLoop);
  let aimController = new AimController(
    gameLoop, characterTransform,
    aimConeRenderer, camera,
    new AimData(Math.PI * 0.5, Math.PI * 0.15, 0.5));
  return new Gun(aimController, recoilCameraShaker);
}

function createCamera(renderLayers: IRenderLayer[], transform: ITransform, loop: ILoop,
  left: number = 10, top: number = 10, width: number = 800, height: number = 600): Camera {
  let camera = new Camera(renderLayers, transform, loop);
  let canvas = camera.createCanvas(left, top, width, height);
  camera.addToDocument();
  return camera;
}

function createRenderLayers(): IRenderLayer[] {
  return [
    new RenderLayer(), // Background
    new RenderLayer(), // Character Legs
    new RenderLayer(), // Character Arms
    new RenderLayer() // Character Torso
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
/**/