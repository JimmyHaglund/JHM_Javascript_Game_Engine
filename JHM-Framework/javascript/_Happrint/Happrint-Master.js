function happrint_start() {
    let Game = new GameManager(0);
    // let myLoop = new Loop(20);
    // let myWindow = new RenderSpace(myLoop, 600, 600);
    // let myPhysics = new PhysicsSpace(myLoop);
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
    // let mouseInput = new MouseInput();
    // let uiSpace = new UiSpace(myWindow, 0, mouseInput);
    // let button = uiSpace.createButton(50, 50, 100, 100, "stopButton_normal", 
    // "stopButton_hover", "stopButton_press"); 
    // button.onClick.add(() => console.log("Button on click called."), this);
    // let buttonColliderOutline = new BoxColliderRenderer(button.collider, 'blue', false);
    // myWindow.addRenderComponent(buttonColliderOutline, 0);
    // let testSheet = OverlaySheet.generateFromImage("page1", myPhysics, myWindow, sheetEntity, 'red', 20);
    // console.log(button.collider);
    // mouseInput.onMouseDown.add(printMousePosition, this);
    // testRb(myWindow);
    // let testLoop = new Loop(30);
    // let testEntity = new Entity(200, 50);
    // let testWalker = new WalkingCharacter(testEntity, myLoop, 760, myWindow, myPhysics);
    // testWalker.shouldMove = true;
    // let sheetEntity = new Entity(100, 100);
    // let testSheet = OverlaySheet.generateFromImage("page1", myPhysics, myWindow, sheetEntity, 'black');
    // let levelManager = new LevelManager(myWindow, myPhysics, uiSpace, mouseInput);
    // levelManager.loadLevel(0);
    /*
    setTimeout(() => levelManager.unloadCurrentLevel(), 1000);
    setTimeout(() => levelManager.loadLevel(0), 2000);
    setTimeout(() => levelManager.unloadCurrentLevel(), 3000);
    setTimeout(() => levelManager.loadLevel(0), 4000);
    setTimeout(() => levelManager.unloadCurrentLevel(), 5000);
    */
    // let testBoxA = new VisibleBoxCollider(300, 300, 10, 10, myWindow, myPhysics, 'blue');
    // myPhysics.addCollider(testBoxA.collider);
    /*
    let testBoxB = new VisibleBoxCollider(150, 0, 5, 100, myWindow, myPhysics, 'blue');
    myPhysics.addCollider(testBoxB.collider);
    let testBoxC = new VisibleBoxCollider(250, 0, 10, 100, myWindow, myPhysics, 'blue');
    myPhysics.addCollider(testBoxC.collider);
    */
    /*
    let testRb = new PointRigidBody(testEntity, myLoop);
    testRb.setVelocity(15, 100);
    let testSprite = new Sprite(testEntity, "character_idle");
    testSprite.width = 30;
    testSprite.height = 45;
    testSprite.offsetX = -testSprite.width / 2;
    testSprite.offsetY = - testSprite.height;
    testEntity.addComponent(testSprite);
    testEntity.addComponent(testRb);
    myWindow.addRenderComponent(testSprite, 0);
    myWindow.canvas.getContext("2d").imageSmoothingEnabled=false;
    // let time = 0;
    myPhysics.addPhysicsActor(testRb);
    
    
    myLoop.onUpdate.add((deltaTime)=> {
        // console.log(testRb.velocityX);
        testRb.velocityY += 100 * deltaTime;
        // time += deltaTime;
        // testRb.velocityY = 300 * Math.sin(time * 10);
    }, this);
       */
    // testLoop.onUpdate.add((deltaTime)=> console.log(deltaTime, testEntity.transform.x, testEntity.transform.y), this);
    /*
    mouseInput.onMouseMove.add((event) =>{
        let x = 50;
        let y = 0;
        let ray = lineToRay(x, y, event.clientX, event.clientY);
        
        // let intersect = testBoxA.collider.getCollisionPointWithRay(x, y, event.clientX, event.clientY);
        let intersect = testBoxA.collider.getCollisionPointWithRay(50, 10, 0, 1);
        if (intersect != null){
            let intersectRay = lineToRay(x, y, intersect.x, intersect.y);
            new RayRender(myWindow, intersectRay.x0,
                intersectRay.y0, intersectRay.lean, intersectRay.length, 'green');
        } else{
            new RayRender(myWindow, x, y, ray.lean, Math.sqrt(event.clientX * event.clientX + event.clientY * event.clientY), 'red');
        }
    }, this);
    */
    // new RayRender(myWindow, 300, 300, 0, 200, 'black', 50000);
    // myLoop.onUpdate.add(() => drawRay(myWindow.canvas.getContext("2d"), 300, 300, 2, 50), this);
}
function printMousePosition(event) {
    console.log("Mouse pos X Y:", event.clientX, event.clientY);
}
function testRb(window) {
    let testLoop = new Loop(5);
    let testEntity = new Entity(20, 20);
    let testRb = new PointRigidBody(testEntity, testLoop);
    testRb.setVelocity(15, 0);
    let testSprite = new Sprite(testEntity, "character_idle");
    testSprite.width = 10;
    testSprite.height = 15;
    testEntity.addComponent(testSprite);
    testEntity.addComponent(testRb);
    window.addRenderComponent(testSprite, 0);
}
function printPage() {
    let img = document.getElementById('page1');
    let canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
    let dataString = "";
    for (let y = 0; y < img.height; y++) {
        for (let x = 0; x < img.width; x++) {
            let pixelData = canvas.getContext('2d').getImageData(x, y, 1, 1).data;
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
let happrint_globalSettings = {};
