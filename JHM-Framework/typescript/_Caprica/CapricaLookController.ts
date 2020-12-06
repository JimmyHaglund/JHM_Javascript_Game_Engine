class CapricaLookController {
    constructor(mouseMoveAction:Action) {
        mouseMoveAction.add(this.UpdateMousePosition, this);
    }

    private UpdateMousePosition(mouseEvent:MouseEvent):void {
        let mouseX = mouseEvent.x;
        let mouseY = mouseEvent.y;
        console.log("Mouse position:", mouseX, ", ", mouseY);
    }
}