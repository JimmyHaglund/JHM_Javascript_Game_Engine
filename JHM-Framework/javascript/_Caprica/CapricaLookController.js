class CapricaLookController {
    constructor(mouseMoveAction) {
        mouseMoveAction.add(this.UpdateMousePosition, this);
    }
    UpdateMousePosition(mouseEvent) {
        let mouseX = mouseEvent.x;
        let mouseY = mouseEvent.y;
        this.LogMousePosition(mouseX, mouseY);
        this.LogMouseAngle(mouseX, mouseY);
        this.LogMouseRotation(mouseX, mouseY);
    }
    LogMousePosition(x, y) {
        console.log("Mouse position:", x, ", ", y);
    }
    LogMouseAngle(mouseX, mouseY) {
        let right = Vector.Right;
        let angle = Algebra.AngleBetween(right.x, -right.y, mouseX, -mouseY);
        console.log("Mouse Angle:", angle, "radians");
    }
    LogMouseRotation(mouseX, mouseY) {
        let right = Vector.Right;
        let offsetX = mouseX - 100;
        let offsetY = mouseY - 100;
        let angle = Algebra.AngleFromToCounterClockwise(right.x, right.y, offsetX, -offsetY);
        console.log("Mouse Rotation:", angle, "radians");
    }
}
