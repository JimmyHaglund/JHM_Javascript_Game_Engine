class CapricaLookController {
    private _sprite:RotatedSprite;
    private _entity:Entity;

    constructor(mouseMoveAction:Action, character:CapricaMainCharacter) {
        mouseMoveAction.add(this.UpdateMousePosition, this);
        this._sprite = character.Sprite;
        this._entity = character.Entity;
    }

    private UpdateMousePosition(mouseEvent:MouseEvent):void {
        let mouseX = mouseEvent.x;
        let mouseY = mouseEvent.y;
        this._entity.transform.rotation = this.GetLookRotation(mouseX, mouseY);
    }

    private GetLookRotation(mouseX:number, mouseY:number):number {
        let right = Vector.Right;
        let entityX = this._entity.x;
        let entityY = this._entity.y;
        let entityToMouseX = mouseX - entityX;
        let entityToMouseY = mouseY - entityY;
        return Algebra.AngleFromToCounterClockwise(right.x, right.y, entityToMouseX, -entityToMouseY);
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