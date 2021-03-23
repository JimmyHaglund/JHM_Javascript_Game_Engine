let movementInput: CapricaMovementInput;
let gameData: {
  playLoop: Loop,
  renderLayers: IRenderLayer[],
  physics: PhysicsSpace,
  mainCharacter: CapricaMainCharacter,
  lookController: CapricaLookController
}

function capricaStart(canvasId: string) {
  let inputLoop = new Loop(60);
  let movementLoop = new Loop(60);
  let physicsLoop = new Loop(60);
  let renderLoop = new Loop(60);
  let renderLayers: IRenderLayer[] = createRenderLayers();
  let cameraTransform = new Transform(0, 0);
  let camera = createCamera(renderLayers, cameraTransform, renderLoop, canvasId);
  let collisionSpaces = [new CollisionSpace()];
  let physicsSpace = new PhysicsSpace(physicsLoop, collisionSpaces);
  let mainCharacter = new CapricaMainCharacter(0, 0, inputLoop, movementLoop, renderLayers[1], 
    renderLayers[2], renderLayers[3], camera, physicsSpace);
  let gun = createGun(cameraTransform, movementLoop, mainCharacter.entity.transform, renderLayers[3], camera);
  let boxes = createTestBoxes(renderLayers[1], collisionSpaces[0]);
  
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
  canvasId: string): Camera {
  let camera = new Camera(renderLayers, transform, loop);
  let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  camera.setCanvas(canvas);
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

function createLoops(): Loop[] {
  return [
    new Loop(), // Input
    new Loop(), // Movement
    new Loop(), // Collision
    new Loop()  // Rendering
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

function createTestBoxes(renderspace: IRenderLayer, collisionSpace: CollisionSpace) : ICollider[] {
  let amount = 10;
  let result = [];
  let width = 50;
  let height = width; 
  for(let n = 0; n < amount; n++) {
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