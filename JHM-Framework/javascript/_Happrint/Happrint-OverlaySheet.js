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
    constructor(renderSpace, physicsSpace, input, entity, color = 'black') {
        this._walls = [];
        this._moveEventId = -1;
        this._grabbedThisFrame = false;
        this._renderSpace = renderSpace;
        this._physicsSpace = physicsSpace;
        this._entity = entity;
        this._color = color;
        this._entity.onDestroy.add(this.destroy, this);
        this._mouseInput = input;
    }
    get walls() { return this._walls; }
    static generateFromImage(imageId, renderSpace, physicsSpace, input, parentEntity, color = 'black', thickness = 10) {
        let blueprint = document.getElementById(imageId);
        if (blueprint == null)
            return null;
        let canvas = document.createElement('canvas');
        canvas.width = blueprint.width;
        canvas.height = blueprint.height;
        canvas.style.left = -2 * canvas.width + 'px';
        canvas.style.top = -2 * canvas.height + 'px';
        canvas.style.position = 'absolute';
        let oX = parentEntity.transform.x;
        let oY = parentEntity.transform.y;
        let context = canvas.getContext('2d');
        context.drawImage(blueprint, 0, 0, blueprint.width, blueprint.height);
        let sheet = new OverlaySheet(renderSpace, physicsSpace, input, parentEntity, color);
        for (let y = 0; y < blueprint.height; y++) {
            for (let x = 0; x < blueprint.width; x++) {
                let pixelData = canvas.getContext('2d').getImageData(x, y, 1, 1).data;
                if (pixelData[0] == 0) {
                    sheet.addWall(0 + x * thickness, 0 + y * thickness, thickness, thickness);
                }
            }
        }
        return sheet;
    }
    grab() {
        if (this._moveEventId != -1)
            return;
        this._grabbedThisFrame = true;
        this._moveEventId = this._mouseInput.onMouseMove.add((event) => {
            this._grabbedThisFrame = false;
            this._entity.transform.x = event.clientX;
            this._entity.transform.y = event.clientY;
        }, this);
    }
    release() {
        if (this._grabbedThisFrame)
            return;
        this._mouseInput.onMouseMove.remove(this._moveEventId);
        this._moveEventId = -1;
    }
    addWall(left, top, width, height) {
        let wall = new VisibleBoxCollider(left, top, width, height, this._renderSpace, this._physicsSpace, this._color);
        wall.entity.transform.parent = this._entity.transform;
        this._walls.push(wall);
    }
    destroy() {
        this._walls.forEach(wall => {
            wall.entity.destroy();
        });
    }
}
