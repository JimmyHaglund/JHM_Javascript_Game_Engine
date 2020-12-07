class CapricaLookController {
    constructor(mouseMoveAction, character) {
        mouseMoveAction.add(this.UpdateMousePosition, this);
        this._sprite = character.Sprite;
        this._entity = character.Entity;
    }
    UpdateMousePosition(mouseEvent) {
        let mouseX = mouseEvent.x;
        let mouseY = mouseEvent.y;
        this._entity.transform.rotation = this.GetLookRotation(mouseX, mouseY);
    }
    GetLookRotation(mouseX, mouseY) {
        let right = Vector.Right;
        let entityX = this._entity.x;
        let entityY = this._entity.y;
        let entityToMouseX = mouseX - entityX;
        let entityToMouseY = mouseY - entityY;
        return Algebra.AngleFromToCounterClockwise(right.x, right.y, entityToMouseX, -entityToMouseY);
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
