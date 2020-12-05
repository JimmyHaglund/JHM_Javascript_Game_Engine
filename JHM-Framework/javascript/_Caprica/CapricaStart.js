let input = new MovementInput();
function CapricaStart() {
    let capricaLoop = new Loop(60);
    let renderSpace = new RenderSpace(capricaLoop, 800, 600);
    let physicsSpace = new PhysicsSpace(capricaLoop);
    let mainCharacter = new CapricaMainCharacter(50, 50, capricaLoop, renderSpace, physicsSpace);
    renderSpace.render();
    console.log("Caprica Started");
}
function CheckInputPressed(event) {
    input.CheckPressed(event); // CheckMovementInput(event);
}
function CheckInputReleased(event) {
    input.CheckReleased(event);
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
