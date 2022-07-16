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
   
   onMouseDown.add(() => {
      console.log("Mouse down");
      let collisionData = mouseBox.collider.GetCollisionPoint(staticBox.collider);
      console.log(collisionData);
      if (collisionData == null) return;
      collisionRenderBox.collider.entity.worldX = mouseBox.collider.entity.worldX + collisionData.x;
      collisionRenderBox.collider.entity.worldY = mouseBox.collider.entity.worldY + collisionData.y;
       
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

function createTestBoxes(renderspace: IRenderLayer, collisionSpace: CollisionSpace): ICollider[] {
   let amount = 10;
   let result = [];
   let width = 50;
   let height = width;
   for (let n = 0; n < amount; n++) {
      let x = n * width;
      let y = 0;
      let box = new VisibleBoxCollider(x, y, width, height, renderspace, collisionSpace);
      result.push(box);
   }
   return result;
}

function createSatBox(color: string = "black", size: number = 50): {collider: SatCollider, renderer: SatColliderRenderer } {
   let entity = new Entity(0, 0);
   let half = size * 0.5;
   let vertices = [
      {x: -half, y: -half},
      {x: -half, y: half},
      {x: half, y: half},
      {x: half, y: -half}
   ];
   let result = new SatCollider(entity, 0, 0, vertices) 
   let renderer = new SatColliderRenderer(result, color);
   return {collider: result, renderer: renderer};
}