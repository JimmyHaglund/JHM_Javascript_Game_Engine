class SheetBuilder {
    constructor(renderSpace, physicsSpace, mouseInput) {
        this._color = 'black';
        this._thickness = 10;
        this._renderSpace = renderSpace;
        this._physicsSpace = physicsSpace;
        this._mouseInput = mouseInput;
    }
    withKeyboardInput(input) {
        this._keyboardInput = input;
        return this;
    }
    withColor(color) {
        this._color = color;
        return this;
    }
    withThickness(thickness) {
        this._thickness = thickness;
        return this;
    }
    buildFromImage(parentEntity, imageId) {
        return OverlaySheet.generateFromImage(imageId, this._renderSpace, this._physicsSpace, this._mouseInput, parentEntity, this._color, this._thickness);
    }
}
