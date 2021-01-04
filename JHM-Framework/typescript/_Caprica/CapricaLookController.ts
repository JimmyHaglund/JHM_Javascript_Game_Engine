class CapricaLookController {
    private _sprite:RotatedSprite;
    private _entity:Entity;
    private _camera:Camera;

    constructor(camera:Camera, character:CapricaMainCharacter) {
        this._sprite = character.sprite;
        this._entity = character.entity;
        this._camera = camera;
    }

    public updateRotation():void {
        this._entity.transform.rotation = this.getLookRotation();
    }

    private getLookRotation():number {
        let entityX = this._entity.transform.worldX;
        let entityY = this._entity.transform.worldY;
        let mouse = this._camera.getMouseWorldPosition();
        let right = vector.right;
        let entityToMouseX = mouse.x - entityX;
        let entityToMouseY = mouse.y - entityY;
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