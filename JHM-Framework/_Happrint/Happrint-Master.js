function happrint_start() {
    console.log("Master started!");
    let startWindow = 
}
/*
function happrint_checkInput(event) {
    // R
    switch (event.keyCode) {
        case 32: // Space
        case 82: // R
        case 114: // r
            happrintInstance.togglePlay();
            break;
        case 103: // g
            happrintInstance.nextLevel();
            break;
        case 49: // 1
            happrintInstance.setHeldOverlay(0);
            break;
        case 50: // 2
            happrintInstance.setHeldOverlay(1);
            break;
        case 51: // 3
            happrintInstance.setHeldOverlay(2);
            break;
        case 52: // 4
            happrintInstance.setHeldOverlay(3);
            break;
        case 53: // 5
            happrintInstance.setHeldOverlay(4);
            break;
    }
    if (event.keyCode == 82 || event.keyCode == 114) {
        // console.log("R pressed");
    }
    if (event.keyCode == 32) { // Space
        happrintInstance.togglePlay();
    }
}
let levelComplete = true;
function Happrint() {
    let loop = new Loop(30);
    let physicsSpace = new PhysicsSpace(0, 0, 800, 600, loop);
    let renderSpace = new RenderSpace(0, 790, 1200, 800, loop);
    renderSpace.canvas.style.position = 'absolute';
    let currentLevel = loadLevel1();
    let heldSheet = currentLevel.sheets[0];
    let nextLevelButton = null;

    let door = new Door();
    let character = new Character(currentLevel.start.x, currentLevel.start.y);
    character.walker.onExit.add(() => {
        if (levelComplete) return;
        levelComplete = true;
        console.log(levelComplete);
        nextLevelButton = new UiElement(renderSpace, 600, 30, 120, 60,
            'nextButton_normal', 'nextButton_hover', 'nextButton_press');
        nextLevelButton.onClick.add(() =>{
            unloadCurrentLevel();
            loadLevel1();
        });
        uiManager.uiElements.push(nextLevelButton);
    });
    let ground = new Ground(100, 100, 600, 400);

    let mouseX = 0;
    let mouseY = 0;
    /*
    let thickness = 10;
    let testColliders = 
    testColliders.forEach(element => {
        element.entity.transform.parent = parent.transform;
    });
    *//*
    
    this.getCharacter = function () { return character; }

    this.stop = function () {
        character.entity.transform.x = currentLevel.start.x;
        character.entity.transform.y = currentLevel.start.y;
        character.walker.moveToLeft = currentLevel.startMoveToLeft;
        character.walker.shouldMove = false;
    }
    this.start = function () {
        this.setHeldOverlay(10);
        character.walker.shouldMove = true;
    }
    this.togglePlay = function () {
        if (character.walker.shouldMove) {
            this.stop();
        } else this.start();
    }
    this.setHeldOverlay = function (index) {
        if (character.walker.shouldMove) return;
        if (index >= currentLevel.sheets.length) {
            heldSheet = null;
        } else {
            heldSheet = currentLevel.sheets[index];
        }
    }
    this.nextLevel = function () {
        unloadCurrentLevel();
    }
    this.previousLevel = function () {

    }
    document.addEventListener("mousemove", (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
        if (heldSheet != null) {
            heldSheet.move(mouseX, mouseY);
        }
    });

    document.addEventListener("mousedown", () => {
        heldSheet = null;
    });

    function Character(posX, posY) {
        this.animationLoop = new Loop(5);
        this.entity = new Entity(posX, posY);
        this.sprite = new SpriteComponent(renderSpace, this.entity,
            'character_idle');
        this.sprite.size.width = 30;
        this.sprite.size.height = 60;
        this.sprite.setOffset(0, this.sprite.size.height * 0.45);
        this.walker = new SimpleWalkingPhysicsActor(this.entity, loop, 60);
        renderSpace.addRenderComponent(this.sprite);
        physicsSpace.addPhysicsActor(this.walker, 0);
        this.entity.addComponent(this.sprite);
        this.entity.addComponent(this.walker);
        this.animationIndex = 0;

        this.animationLoop.update.add(() => {
            let char = happrintInstance.getCharacter();
            if (char.walker.falling) return;
            if (levelComplete){
                char.sprite.spriteId = 'character_idle';
                return;
            }
            if (char.animationIndex == 0) {
                char.animationIndex = 1;
            } else {
                char.animationIndex = 0;
            }
            if (this.walker.movingLeft) {
                if (char.animationIndex == 0) {
                    char.sprite.spriteId = 'character_walk_left_1';
                } else {
                    char.sprite.spriteId = 'character_walk_left_2';
                }
            } else {
                if (char.animationIndex == 0) {
                    char.sprite.spriteId = 'character_walk_right_1';
                } else {
                    char.sprite.spriteId = 'character_walk_right_2';
                }
            }
        });
        this.walker.onGroundedChanged.add(() => {
            if (this.walker.falling) {
                this.sprite.spriteId = 'character_fall';
            } else {
                this.sprite.spriteId = 'character_idle';
            }
        });
    }
    function Door() {
        this.entity = new Entity(200, 435);
        this.sprite = new SpriteComponent(renderSpace, this.entity, 'door');
        this.sprite.size.width = 70;
        this.sprite.size.height = 75;
        this.sprite.setOffset(this.sprite.size.width * 0.5, -this.sprite.size.height * 0.5);
        this.collider = new BoxColliderComponent(this.entity, 70, 75);
        this.debugDraw = new BoxColliderRendererComponent(this.collider);


        physicsSpace.addCollider(this.collider, 'exit');
        renderSpace.addRenderComponent(this.sprite);
        renderSpace.addRenderComponent(this.debugDraw);
    }

    function Ground(leftCoord, topCoord, width, height) {
        let thickness = 10;
        this.borders = [
            new VisibleBoxColliderEntity(leftCoord, topCoord, thickness, height, renderSpace, physicsSpace),
            new VisibleBoxColliderEntity(leftCoord, topCoord, width, thickness, renderSpace, physicsSpace),
            new VisibleBoxColliderEntity(leftCoord + width, topCoord, thickness, height + thickness, renderSpace, physicsSpace),
            new VisibleBoxColliderEntity(leftCoord, topCoord + height, width + thickness, thickness, renderSpace, physicsSpace),
        ];
    }

    function loadLevel1() {
        if (!levelComplete) return;
        let settings = new LevelSettings(250, 250);
        let sheets = [
            new OverlaySheet(renderSpace, physicsSpace, 0, 0, '#909090', 1),
            new OverlaySheet(renderSpace, physicsSpace, 0, 0, '#757575', 2),
            new OverlaySheet(renderSpace, physicsSpace, 0, 0, '#757575', 3),
            new OverlaySheet(renderSpace, physicsSpace, 0, 0, '#757575', 4),
            new OverlaySheet(renderSpace, physicsSpace, 0, 0, '#757575', 5)
        ];
        let startButton = new UiElement(renderSpace, 100, 30, 80, 60,
            'playButton_normal', 'playButton_hover', 'playButton_press');
        let stopButton = new UiElement(renderSpace, 200, 30, 80, 60,
            'stopButton_normal', 'stopButton_hover', 'stopButton_press');
        startButton.onClick.add(() => { happrintInstance.start() });
        stopButton.onClick.add(() => happrintInstance.stop());
        uiManager.uiElements.push(startButton);
        uiManager.uiElements.push(stopButton);

        sheets[0].addWall(0, 0, 10, 100);
        sheets[0].addWall(0, 10, 50, 10)
        sheets[1].addWall(0, 0, 500, 5);
        sheets[1].addWall(50, 0, 5, 30);
        sheets.forEach((sheet) => {
            settings.addSheet(sheet);
        });
        levelComplete = false;
        return settings;
    }
    function unloadCurrentLevel() {
        currentLevel.sheets.forEach((sheet) => {
            sheet.destroy();
        });
        uiManager.clear();
        nextLevelButton = null;
    }
}
let uiManager = new UiManager();
let happrintInstance = new Happrint();
*/