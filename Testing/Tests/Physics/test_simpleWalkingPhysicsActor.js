function test_simpleWalkjngPhysicsActor() {

}

function WalkingActorTestClass() {
    let mouseX = 0, mouseY = 0;

    let loop = new Loop(30);
    let entity = new Entity(250, 250);
    let space = new PhysicsSpace(100, 100, 640, 480, loop);
    // let collider = new BoxColliderComponent(entity, 50, 20);
    let window = new RenderSpace(10, 200, 640, 480, loop);
    window.canvas.style.position = 'absolute';
    window.setPosition(0, 480);
    let image = new SpriteComponent(window, entity, 'face');
    let walker = new SimpleWalkingPhysicsActor(entity, loop, 60);
    window.addRenderComponent(image);
    // space.addCollider(collider, 0);
    space.addPhysicsActor(walker, 0);
    entity.addComponent(walker);
    // entity.addComponent(collider);
    entity.addComponent(image);
    let thickness = 10;
    let testColliders = [
        new VisibleBoxColliderEntity(0, 0, thickness, 1000, window, space),
        new VisibleBoxColliderEntity(0, 0, 1000, thickness, window, space),
        new VisibleBoxColliderEntity(590, 0, thickness, 1000, window, space),
        new VisibleBoxColliderEntity(0, 430, 1000, thickness, window, space),
        
    ]

    loop.update.add(() => {
        // entity.transform.worldX = mouseX;
        // entity.transform.worldY = mouseY;
        // console.log(entity.transform.worldX, entity.transform.worldY);
        // console.log(image);
    });
    document.onmousemove = (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
        walker.speed = mouseY * 0.3;
        // console.log("mouse pos:", mouseX, mouseY);
        // console.log("enitty pos: ", testCollider.entity.transform.worldX, testCollider.entity.transform.worldY);
        // console.log(testCollider.collider.bounds.left, testCollider.collider.bounds.right);
        // console.log(testCollider.collider.bounds.bottom, testCollider.collider.bounds.top);
    }
}

function VisibleBoxColliderEntity(posX, posY, width, height, renderSpace, physicsSpace) {
    this.entity = new Entity(posX, posY);
    this.collider = new BoxColliderComponent(this.entity, width, height);
    this.visual = new BoxColliderRendererComponent(this.collider);

    this.entity.addComponent(this.collider);
    this.entity.addComponent(this.visual);

    renderSpace.addRenderComponent(this.visual);
    physicsSpace.addCollider(this.collider, 0);
}
let walkingActorTestClass = new WalkingActorTestClass();