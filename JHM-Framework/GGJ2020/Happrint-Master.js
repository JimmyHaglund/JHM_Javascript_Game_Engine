function happrint_start() {

}
function happrint_checkInput(event){
    // R
    if (event.keyCode == 82 || event.keyCode == 114){
        // console.log("R pressed");
        happrintInstance.resetCharacter();
    } 
}

function Happrint() {
    this.resetCharacter = function(){
        character.entity.transform.x = currentLevel.start.x;
        character.entity.transform.y = currentLevel.start.y;
        character.walker.moveToLeft = currentLevel.startMoveToLeft;
    }

    let loop = new Loop(30);
    
    let physicsSpace = new PhysicsSpace(0, 0, 800, 600, loop);
    let renderSpace = new RenderSpace(0, 600, 800, 600, loop);
    renderSpace.canvas.style.position = 'absolute';
    let currentLevel = loadLevel1();
    let heldSheet = currentLevel.sheets[0];

    let character = new Character(currentLevel.start.x, currentLevel.start.y);
    let ground = new Ground(100, 100, 600, 400);
    /*
    let thickness = 10;
    let testColliders = 
    testColliders.forEach(element => {
        element.entity.transform.parent = parent.transform;
    });
    */
   let mouseX = 0;
   let mouseY = 0;
    document.onmousemove = (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
        if (heldSheet != null){
            heldSheet.move(mouseX, mouseY);
        }
    }

    function Character(posX, posY){
        this.entity = new Entity(posX, posY);
        this.sprite = new SpriteComponent(renderSpace, this.entity, 'face');
        this.walker = new SimpleWalkingPhysicsActor(this.entity, loop, 60);
        
        renderSpace.addRenderComponent(this.sprite);
        physicsSpace.addPhysicsActor(this.walker, 0);
        this.entity.addComponent(this.sprite);
        this.entity.addComponent(this.walker);
        // this.sprite.setOffset(0, 0);
    }

    function Ground(leftCoord, topCoord, width, height){
        let thickness = 10;
        this.borders = [
            new VisibleBoxColliderEntity(leftCoord, topCoord, thickness, height, renderSpace, physicsSpace),
            new VisibleBoxColliderEntity(leftCoord, topCoord, width, thickness, renderSpace, physicsSpace),
            new VisibleBoxColliderEntity(leftCoord + width, topCoord, thickness, height + thickness, renderSpace, physicsSpace),
            new VisibleBoxColliderEntity(leftCoord, topCoord + height, width + thickness, thickness, renderSpace, physicsSpace),
        ];
    }

    function loadLevel1(){
        let settings = new LevelSettings(250, 250);
        let sheets = [
            new OverlaySheet(renderSpace, physicsSpace, 0, 0),
        ]; 
        sheets[0].addWall(0, 0, 10, 100);
        sheets[0].addWall(0, 10, 50, 10)
        sheets.forEach((sheet) => {
            settings.addSheet(sheet);
        });
        return settings;
    }
    function unloadCurrentLevel(){
        currentLevel.sheets.forEach((sheet) =>{
            sheet.destroy();
        });
    }
}
let happrintInstance = new Happrint();