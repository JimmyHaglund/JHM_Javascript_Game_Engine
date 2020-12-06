class CapricaLookController {
    constructor(mouseMoveAction) {
        mouseMoveAction.add(this.UpdateMousePosition, this);
    }
    UpdateMousePosition(mouseEvent) {
        let mouseX = mouseEvent.x;
        let mouseY = mouseEvent.y;
        console.log("Mouse position:", mouseX, ", ", mouseY);
    }
}
