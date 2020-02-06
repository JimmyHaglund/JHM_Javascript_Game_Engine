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
    constructor(renderSpace, physicsSpace, entity, color = 'black') {
        this._walls = [];
        this._renderSpace = renderSpace;
        this._physicsSpace = physicsSpace;
        this._entity = entity;
        this._color = color;
        this._entity.onDestroy.add(this.destroy, this);
    }
    static generateFromImage(imageId, physicsSpace, renderSpace, parentEntity, color = 'black') {
        let blueprint = document.getElementById(imageId);
        if (blueprint == null)
            return null;
        let canvas = document.createElement('canvas');
        canvas.width = blueprint.width;
        canvas.height = blueprint.height;
        canvas.style.left = -2 * canvas.width + 'px';
        canvas.style.top = -2 * canvas.height + 'px';
        canvas.style.position = 'absolute';
        let context = canvas.getContext('2d');
        context.drawImage(blueprint, 0, 0, blueprint.width, blueprint.height);
        let sheet = new OverlaySheet(renderSpace, physicsSpace, parentEntity, color);
        let thickness = 10;
        // let dataString = "";
        for (let y = 0; y < blueprint.height; y++) {
            for (let x = 0; x < blueprint.width; x++) {
                let pixelData = canvas.getContext('2d').getImageData(x, y, 1, 1).data;
                if (pixelData[0] == 0) {
                    // let box = new VisibleBoxCollider(x * 10, y * 10, 10, 10, renderSpace, physicsSpace, color);
                    // box.entity.transform.parent = parentEntity.transform;
                    sheet.addWall(x * thickness, y * thickness, thickness, thickness);
                }
            }
        }
        return sheet;
    }
    get walls() { return this._walls; }
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
