class SheetBuilder {
    private _color: string = 'black';
    private _thickness: number = 10;
    private _renderSpace: RenderSpace;
    private _physicsSpace: PhysicsSpace;
    private _mouseInput: MouseInput;
    private _keyboardInput: KeyboardInput;
    private _imageId: string;

    constructor(renderSpace: RenderSpace, physicsSpace: PhysicsSpace, mouseInput: MouseInput) {
        this._renderSpace = renderSpace;
        this._physicsSpace = physicsSpace;
        this._mouseInput = mouseInput;
    }

    withKeyboardInput(input: KeyboardInput): SheetBuilder {
        this._keyboardInput = input;
        return this;
    }

    withColor(color: string): SheetBuilder {
        this._color = color;
        return this;
    }

    withThickness(thickness: number): SheetBuilder {
        this._thickness = thickness;
        return this;
    }

    buildFromImage(parentEntity: Entity, imageId: string): OverlaySheet {
        return OverlaySheet.generateFromImage(imageId, this._renderSpace, this._physicsSpace,
            this._mouseInput, parentEntity, this._color, this._thickness);
    }
}