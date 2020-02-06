function happrint_start() {
    let myWindow = new RenderSpace(new Loop(10), 600, 600);
    let myPhysics = new PhysicsSpace(new Loop(20));
    let myEntity = new Entity(10, 50);
    // let mySprite = new Sprite(myEntity, "playButton_normal");
    let myButton = new BoxButton(myWindow, myPhysics, 50, 50, 100, 100, "button_1_normal", "button_1_hover", "button_1_press");
    // myWindow.addRenderComponent(mySprite, 0);
}
