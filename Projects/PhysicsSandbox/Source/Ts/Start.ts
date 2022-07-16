let gameData: {
   mainLoop: Loop,
   renderLayers: IRenderLayer[],
   physics: PhysicsSpace
};

let various: any = {};

function start(canvasId: string) {
   let renderLayers = createRenderLayers();
   let mainLoop = new Loop(60);
   let cameraTransform = new Transform(0, 0);
   let camera = createCamera(
      renderLayers,
      cameraTransform,
      mainLoop,
      canvasId
   );
   let collisionSpaces = [new CollisionSpace()];
   let physics = new PhysicsSpace(mainLoop, collisionSpaces);
   gameData = {
      mainLoop: mainLoop,
      renderLayers: renderLayers,
      physics: physics
   }

   let mouseBox = createSatBox(); // new VisibleBoxCollider(0, 0, 10, 10, renderLayers[1], new CollisionSpace(), "red", false);
   let staticBox = createSatBox();
   let collisionRenderBox = createSatBox("red", 5);
   // let mousePhysics = new PointRigidBody(mouseCollider.entity);
   renderLayers[1].addRenderable(mouseBox.renderer);
   renderLayers[1].addRenderable(staticBox.renderer);
   renderLayers[1].addRenderable(collisionRenderBox.renderer);

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
      let collisionData = mouseBox.collider.GetCollisionPoint(staticBox.collider);
      if (collisionData == null) return;
      collisionRenderBox.collider.entity.worldX = mouseBox.collider.entity.worldX + collisionData.x;
      collisionRenderBox.collider.entity.worldY = mouseBox.collider.entity.worldY + collisionData.y;
      
      staticBox.collider.entity.worldX -= collisionData.normalX;
      staticBox.collider.entity.worldY -= collisionData.normalY;

   }, mouseBox);

}

function createRenderLayers(): IRenderLayer[] {
   return [
      new RenderLayer(), // Background
      new RenderLayer() // Actors
   ]
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

function createSatBox(color: string = "black", size: number = 100): {collider: SatCollider, renderer: SatColliderRenderer } {
   let entity = new Entity(0, 0);
   let mod = size * 0.5;
   let vertices = [
      {x: -0.538 * mod, y: -0.638 * mod},
      {x: -0.923 * mod, y: -0.014 * mod},
      {x: -0.595 * mod, y: 0.857 * mod},
      {x: 0.504 * mod, y: 0.866 * mod},
      {x: 0.934 * mod, y: -0.008 * mod},
      {x: 0.415 * mod, y: -0.758 * mod},
   ];
   let result = new SatCollider(entity, 0, 0, vertices) 
   let renderer = new SatColliderRenderer(result, color);
   return {collider: result, renderer: renderer};
}