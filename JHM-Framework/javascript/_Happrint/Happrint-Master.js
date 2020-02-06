function happrint_start() {
    let myWindow = new RenderSpace(new Loop(10), 600, 600);
    let myPhysics = new PhysicsSpace(new Loop(20));
    let myEntity = new Entity(10, 50);
    let mySprite = new Sprite(myEntity, "playButton_normal");
    let myButton = new BoxButton(myWindow, myPhysics, 0, 0, 75, 50, "button_1_normal", "button_1_hover", "button_1_press");
    let uiLoop = new UiLoop();
    let inputSystem = new Input();
    let myAction = new Action();
    myAction.add(() => console.log("Action invoked!"), this);
    inputSystem.bindKeyAction(myAction, "w");
    myWindow.addRenderComponent(mySprite, 0);
}
