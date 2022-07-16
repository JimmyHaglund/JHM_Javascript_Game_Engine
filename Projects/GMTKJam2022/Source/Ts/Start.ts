// Dependencies: SatCollider SatColliderRenderer WindowEvents MovementInput

// Dependencies: WindowEvents
let gameData: {
   playLoop: Loop,
   renderLayers: IRenderLayer[],
   physics: PhysicsSpace
};
let movementInput = new MovementInput();

function quantumCoinStart(canvasId: string) {
   let inputLoop = new Loop(60);
   let movementLoop = new Loop(60);
   let physicsLoop = new Loop(60);
   let renderLoop = new Loop(60);

   let renderLayers: IRenderLayer[] = createRenderLayers();
   let cameraTransform = new Transform(0, 0);
   let camera = createCamera(renderLayers, cameraTransform, renderLoop, canvasId);
   let collisionSpaces = [new CollisionSpace()];
   let physics = new SatPhysicsSpace();
   
   

   console.log("Quantum Coin Started");
}

function createCamera(renderLayers: IRenderLayer[], transform: ITransform, loop: ILoop,
   canvasId: string): Camera {
   let camera = new Camera(renderLayers, transform, loop);
   let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
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
   var collider = entity.getComponent<BoxCollider>(Type.boxCollider);
   console.log(collider);
}

function createRenderLayers(): IRenderLayer[] {
   return [
      new RenderLayer(), // Far Background
      new RenderLayer(), // Mid Background
      new RenderLayer(), // Close Background
      new RenderLayer(), // Non-player entities
      new RenderLayer(), // Player entity
      new RenderLayer()  // UI
   ];
}

function checkInputPressed(event: KeyboardEvent) {
   movementInput.CheckPressed(event);
}

function checkInputReleased(event: KeyboardEvent) {
   movementInput.CheckReleased(event);
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