class CapricaLookController {
    constructor(mouseMoveAction:Action) {
        mouseMoveAction.add(this.UpdateMousePosition, this);
    }

    private UpdateMousePosition(mouseEvent:MouseEvent):void {
        let mouseX = mouseEvent.x;
        let mouseY = mouseEvent.y;
    }
    
    private LogMousePosition(x:number, y:number) {
        console.log("Mouse position:", x, ", ", y);
    }
    
    private LogMouseAngle(mouseX:number, mouseY:number) {
        let right = Vector.Right;
        let angle = Algebra.AngleBetween(right.x, -right.y, mouseX, -mouseY);
        console.log("Mouse Angle:", angle, "radians");
    }

    private LogMouseRotation(mouseX:number, mouseY:number) {
        let right = Vector.Right;
        let offsetX = mouseX - 100;
        let offsetY = mouseY - 100;
        let angle = Algebra.AngleFromToCounterClockwise(right.x, right.y, offsetX, -offsetY);
        console.log("Mouse Rotation:", angle, "radians");
    }
}