let MovementInput: CapricaMovementInput;
let GameData: {
  playLoop: Loop,
  render: RenderSpace,
  physics: PhysicsSpace,
  mainCharacter: CapricaMainCharacter,
  lookController: CapricaLookController
}
function CapricaStart() {
  let loop = new Loop(60);
  let renderSpace = new RenderSpace(loop, 800, 600);
  let physicsSpace = new PhysicsSpace(loop);
  let mainCharacter =  new CapricaMainCharacter(50, 50,
    loop, renderSpace, physicsSpace);
  let lookController = new CapricaLookController(OnMouseMoved, mainCharacter);
  GameData = {
    playLoop: loop,
    render: renderSpace,
    physics: physicsSpace,
    mainCharacter: mainCharacter,
    lookController: lookController
  };
  renderSpace.Render();
  MovementInput = mainCharacter.Input;
  console.log("Caprica Started");
}
function CheckInputPressed(event: KeyboardEvent) {
  MovementInput.CheckPressed(event);
}

function CheckInputReleased(event: KeyboardEvent) {
  MovementInput.CheckReleased(event);
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