class CapricaLookController {
    constructor(mouseMoveAction, character) {
        mouseMoveAction.add(this.updateMousePosition, this);
        this._sprite = character.sprite;
        this._entity = character.entity;
    }
    updateMousePosition(mouseEvent) {
        let mouseX = mouseEvent.x;
        let mouseY = mouseEvent.y;
        this._entity.transform.rotation = this.getLookRotation(mouseX, mouseY);
    }
    getLookRotation(mouseX, mouseY) {
        let right = vector.right;
        let entityX = this._entity.x;
        let entityY = this._entity.y;
        let entityToMouseX = mouseX - entityX;
        let entityToMouseY = mouseY - entityY;
        return algebra.angleFromToCounterClockwise(right.x, right.y, entityToMouseX, -entityToMouseY);
    }
    logMousePosition(x, y) {
        console.log("Mouse position:", x, ", ", y);
    }
    logMouseAngle(mouseX, mouseY) {
        let right = vector.right;
        let angle = algebra.angleBetween(right.x, -right.y, mouseX, -mouseY);
        console.log("Mouse Angle:", angle, "radians");
    }
    logMouseRotation(mouseX, mouseY) {
        let right = vector.right;
        let offsetX = mouseX - 100;
        let offsetY = mouseY - 100;
        let angle = algebra.angleFromToCounterClockwise(right.x, right.y, offsetX, -offsetY);
        console.log("Mouse Rotation:", angle, "radians");
    }
}
