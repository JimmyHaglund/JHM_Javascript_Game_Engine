function happrint_start() {

}

function WalkingActorTestClass() {
    let parent = new Entity(0, 0);

    let mouseX = 0, mouseY = 0;
    let loop = new Loop(30);
    let entity = new Entity(250, 250);
    let space = new PhysicsSpace(100, 100, 640, 480, loop);
    // let collider = new BoxColliderComponent(entity, 50, 20);
    let window = new RenderSpace(10, 200, 640, 480, loop);
    let testSheet = new OverlaySheet(window, space, 0, 0);
    testSheet.addWall(0, 0, 10, 1000);
    // window.canvas.style.position = 'absolute';
    window.setPosition(0, 480);
    let image = new SpriteComponent(window, entity, 'face');
    let walker = new SimpleWalkingPhysicsActor(entity, loop, 60);
    window.addRenderComponent(image);
    // space.addCollider(collider, 0);
    space.addPhysicsActor(walker, 0);
    entity.addComponent(walker);
    // entity.addComponent(collider);
    entity.addComponent(image);
    entity.transform.parent = parent.transform;
    let thickness = 10;
    let testColliders = [
        new VisibleBoxColliderEntity(0, 0, thickness, 1000, window, space),
        new VisibleBoxColliderEntity(0, 0, 1000, thickness, window, space),
        new VisibleBoxColliderEntity(590, 0, thickness, 1000, window, space),
        new VisibleBoxColliderEntity(0, 430, 1000, thickness, window, space),
    ]
    testColliders.forEach(element => {
        element.entity.transform.parent = parent.transform;
    });

    loop.update.add(() => {
        // entity.transform.worldX = mouseX;
        // entity.transform.worldY = mouseY;
        // console.log(entity.transform.worldX, entity.transform.worldY);
        // console.log(image);
    });
    document.onmousemove = (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
        // walker.speed = mouseY * 0.3;
        // parent.transform.x = mouseX* 0.1;
        // parent.transform.y = mouseY * 0.1;
        testSheet.move(mouseX, mouseY);
        // console.log("mouse pos:", mouseX, mouseY);
        // console.log("enitty pos: ", testCollider.entity.transform.worldX, testCollider.entity.transform.worldY);
        // console.log(testCollider.collider.bounds.left, testCollider.collider.bounds.right);
        // console.log(testCollider.collider.bounds.bottom, testCollider.collider.bounds.top);
    }
}
let walkingActorTestClass = new WalkingActorTestClass();