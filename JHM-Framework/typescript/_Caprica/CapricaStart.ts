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
  let cameraTransform = new Transform(0, 0);
  let camera = createCamera(renderLayers, cameraTransform, loop);
  // Heres' a volatile situation: the AimConeController will cache the game loop and dynamically add and remove itself
  // when the user starts respectively stops aiming.
  // As a result, the aimconecontroller can be assumed to always be last in the update loop.
  // The aimconecontroller updates its position in its loop, while the character updates its positions as part of the physics loop.
  // Meanwhile, they both render as part of the camera render update loop.
  // As a result, if the physics loop is added before the rendering loop the order would be
  // character move -> render -> aim cone move. The aim cone will seem to lag behind the character.
  // This is the volatile part: simply changing the order that loops are added will cause a bug.
  // The solution would be to separate the game/position and the render loops in a better way, either
  // by explicitly defining two separate loops, or by refactoring/restructuring the aim cone to work better with existing systems.
  let physicsSpace = new PhysicsSpace(loop);
  let mainCharacter = new CapricaMainCharacter(0, 0, loop, renderLayers[1], camera, physicsSpace)
  cameraTransform.parent = mainCharacter.entity.transform;
  movementInput = mainCharacter.input;
  gameData = {
    playLoop: loop,
    renderLayers: renderLayers,
    physics: physicsSpace,
    mainCharacter: mainCharacter,
    lookController: null
  };

  runDevTests();
  // let secondCamera = createCamera(renderLayers, new Transform(200, 200), loop, 
  // 820, 10, 360, 240);
  console.log("Caprica Started");

  onMouseDown.add(() => generateShaker(cameraTransform), null);

}

function generateShaker(transform:Transform):void {
  let shakeDisplacement = {min:5, max:20};
  let loop = gameData.playLoop;
  let shaker = new Shaker(transform, loop, 10, shakeDisplacement);
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