class CapricaLookController {
    private _sprite:RotatedSprite;
    private _entity:Entity;

    constructor(mouseMoveAction:Action, character:CapricaMainCharacter) {
        mouseMoveAction.add(this.updateMousePosition, this);
        this._sprite = character.sprite;
        this._entity = character.entity;
    }

    private updateMousePosition(mouseEvent:MouseEvent):void {
        let mouseX = mouseEvent.x;
        let mouseY = mouseEvent.y;
        this._entity.transform.rotation = this.getLookRotation(mouseX, mouseY);
    }

    private getLookRotation(mouseX:number, mouseY:number):number {
        let right = vector.right;
        let entityX = this._entity.x;
        let entityY = this._entity.y;
        let entityToMouseX = mouseX - entityX;
        let entityToMouseY = mouseY - entityY;
        return algebra.angleFromToCounterClockwise(right.x, right.y, entityToMouseX, -entityToMouseY);
    }
    
    private logMousePosition(x:number, y:number) {
        console.log("Mouse position:", x, ", ", y);
    }
    
    private logMouseAngle(mouseX:number, mouseY:number) {
        let right = vector.right;
        let angle = algebra.angleBetween(right.x, -right.y, mouseX, -mouseY);
        console.log("Mouse Angle:", angle, "radians");
    }

    private logMouseRotation(mouseX:number, mouseY:number) {
        let right = vector.right;
        let offsetX = mouseX - 100;
        let offsetY = mouseY - 100;
        let angle = algebra.angleFromToCounterClockwise(right.x, right.y, offsetX, -offsetY);
        console.log("Mouse Rotation:", angle, "radians");
    }
}