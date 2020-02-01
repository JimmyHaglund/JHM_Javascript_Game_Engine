function test_boxColliderComponent(){

}

function BoxColliderTestClass(){
    let mouseX = 0, mouseY = 0;
    document.onmousemove = (event) =>{
        mouseX = event.clientX;
        mouseY = event.clientY;
    }
    let loop = new Loop(3);
    let entity = new Entity();
    let space = new PhysicsSpace(0, 0, 100, 100, loop);
    let collider = new BoxColliderComponent(entity, 50, 20);
    space.addCollider(collider, 0);
    entity.addComponent(collider);
    loop.update.add(() =>{
         // console.log("mouse pos:", mouseX, mouseY);
         // console.log("enitty pos: ", entity.transform.worldX, entity.transform.worldY);
        //if (collider.overlapsPoint(mouseX, mouseY)){
         //   console.log("Mouse is inside collider!");
       // }
    });
}
let boxColliderTestClass = new BoxColliderTestClass();

let boxColliderComponentTester = {
    box_should_return_correct_size: function(){
    }
}