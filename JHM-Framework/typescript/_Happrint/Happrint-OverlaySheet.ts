/*
const overlayColors = [
    '#354281', // Blue
    '#356d39', // Green
    '#bc5469', // Red
    '#aa8912', // Orange
    '#6d4767' // Purple
]
*/
class OverlaySheet {
    private _walls: VisibleBoxCollider[] = [];
    private _renderSpace: RenderSpace;
    private _physicsSpace: PhysicsSpace;
    private _entity: Entity;
    private _color: string;
    private _mouseInput: MouseInput;
    private _moveEventId: number = -1;
    private _grabbedThisFrame: boolean = false;

    get walls() { return this._walls; }

    private constructor(renderSpace: RenderSpace, physicsSpace: PhysicsSpace, input: MouseInput, entity: Entity, color: string = 'black') {
        this._renderSpace = renderSpace;
        this._physicsSpace = physicsSpace;
        this._entity = entity;
        this._color = color;
        this._entity.onDestroy.add(this.destroy, this);
        this._mouseInput = input;
    }

    static generateFromImage(imageId: string, renderSpace: RenderSpace, physicsSpace: PhysicsSpace,
        input: MouseInput, parentEntity: Entity, color: string = 'black', thickness = 10): OverlaySheet {
        let blueprint: HTMLImageElement = document.getElementById(imageId) as HTMLImageElement;
        if (blueprint == null) return null;
        let canvas: HTMLCanvasElement = document.createElement('canvas');
        canvas.width = blueprint.width;
        canvas.height = blueprint.height;
        canvas.style.left = -2 * canvas.width + 'px';
        canvas.style.top = -2 * canvas.height + 'px';
        canvas.style.position = 'absolute';
        let oX = parentEntity.transform.x;
        let oY = parentEntity.transform.y;
        let context: CanvasRenderingContext2D = canvas.getContext('2d');
        context.drawImage(blueprint, 0, 0, blueprint.width, blueprint.height);
        let sheet = new OverlaySheet(renderSpace, physicsSpace, input, parentEntity, color);
        // let dataString = "";
        for (let y = 0; y < blueprint.height; y++) {
            for (let x = 0; x < blueprint.width; x++) {
                let pixelData = canvas.getContext('2d').getImageData(x, y, 1, 1).data;
                if (pixelData[0] == 0) {
                    // let box = new VisibleBoxCollider(x * 10, y * 10, 10, 10, renderSpace, physicsSpace, color);
                    // box.entity.transform.parent = parentEntity.transform;
                    sheet.addWall(oX + x * thickness, oY + y * thickness, thickness, thickness);
                }
            }
        }
        return sheet;
    }

    grab(): void {
        this._grabbedThisFrame = true;
        this._moveEventId = this._mouseInput.onMouseMove.add((event: MouseEvent) => {
            this._grabbedThisFrame = false;
            this._entity.transform.x = event.clientX;
            this._entity.transform.y = event.clientY;
        }, this);
    }
    release(): void {
        if (this._grabbedThisFrame) return;
        this._mouseInput.onMouseMove.remove(this._moveEventId);
    }

    addWall(left: number, top: number, width: number, height: number) {
        let wall = new VisibleBoxCollider(left, top, width, height, this._renderSpace, this._physicsSpace, this._color);
        wall.entity.transform.parent = this._entity.transform;
        this._walls.push(wall);
    }
    destroy() {
        console.log("destroy called on overlay sheet.");
        this._walls.forEach(wall => {
            wall.entity.destroy();
        });
    }
}