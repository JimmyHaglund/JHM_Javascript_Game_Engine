function happrint_start() {
    let myWindow = new RenderSpace(new Loop(60), 600, 600);
    // let myPhysics = new PhysicsSpace(new Loop(20));
    // let myEntity = new Entity(0, 0);
    // let mySprite = new Sprite(myEntity, "page1");
    // mySprite.width = 320;
    // mySprite.height = 320;
    // myWindow.addRenderComponent(mySprite, 0);
    // let myButton = new BoxButton(myWindow, myPhysics, 0, 0, 75, 50, "button_1_normal", "button_1_hover", "button_1_press");
    // let uiLoop = new UiLoop();
    // let inputSystem = new Input();
    // let myAction = new Action();
    // myAction.add(() => console.log("Action invoked!"), this);
    // inputSystem.bindKeyAction(myAction, "w");
    // printPage();
    // myWindow.canvas.getContext('2d').imageSmoothingEnabled = false; // Disable antialiasing

    // let visibleBox = new VisibleBoxCollider(0, 0, 50, 300, myWindow, myPhysics, "red");
    // visibleBox.outlineOnly = true;
    // let testSheet = OverlaySheet.generateFromImage("page1", myPhysics, myWindow, new Entity(0, 0), 'black');
    let mouseInput = new MouseInput();
    let uiSpace = new UiSpace(myWindow, 0, mouseInput);
    let button = uiSpace.createButton(0, 0, 100, 100, "stopButton_normal", 
    "stopButton_hover", "stopButton_press"); 
    // button.onClick.add(() => console.log("Button on click called."), this);
    let buttonColliderOutline = new BoxColliderRenderer(button.collider, 'blue', false);
    myWindow.addRenderComponent(buttonColliderOutline, 0);
    // console.log(button.collider);
    // mouseInput.onMouseDown.add(printMousePosition, this);

}

function printMousePosition(event: MouseEvent) {
    console.log("Mouse pos X Y:", event.clientX, event.clientY);
}

function printPage() {
    let img: HTMLImageElement = document.getElementById('page1') as HTMLImageElement;
    let canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
    let dataString = "";
    for (let y = 0; y < img.height; y++) {
        for (let x = 0; x < img.width; x++) {
            let pixelData: Uint8ClampedArray = canvas.getContext('2d').getImageData(x, y, 1, 1).data;
            dataString += pixelData[0] > 0 ? "." : "X";
        }
        dataString += "\n";
    }
    console.log(dataString);
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