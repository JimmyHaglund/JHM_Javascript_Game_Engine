function CapricaStart() {
  let capricaLoop = new Loop(60);
  let renderSpace = new RenderSpace(capricaLoop, 800, 600);
  let physicsSpace = new PhysicsSpace(capricaLoop);
  let testEntity = MakeTestEntity(renderSpace, physicsSpace, capricaLoop);

  renderSpace.render();

  console.log("Lawler Started");
}

function MakeTestEntity(renderSpace:RenderSpace, physicsSpace:PhysicsSpace, loop:Loop):Entity {
  let entity = new Entity(100, 100);
  var sprite = new Sprite(entity, "character_idle");
  let physicsActor = new PointRigidBody(entity, loop);
  renderSpace.addRenderComponent(sprite, 0);
  physicsSpace.addPhysicsActor(physicsActor);
  entity.addComponent(sprite);

  return entity;
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