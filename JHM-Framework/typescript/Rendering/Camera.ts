class Camera {
    private _transform:ITransform;
    private _renderSpace:RenderLayer;
    
    public get centreX():number { return }
    public positionY:number = 0;

    constructor(renderSpace:RenderLayer, transform:ITransform) {
        this._transform = transform;
        this._renderSpace = renderSpace;
    }
}