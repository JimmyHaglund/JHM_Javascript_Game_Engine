class Camera {
    private _transform:ITransform;
    private _layers:RenderLayer[];
    
    public get centreX():number { return }
    public positionY:number = 0;

    constructor(layers:RenderLayer[], transform:ITransform, loop:ILoop) {
        this._transform = transform;
        this._layers = layers;

        loop.onUpdate.add(this.render, this);
    }

    public render() {
        for (let n = 0; n < this._layers.length; n++) {
            let layer = this._layers[n];
            let offsetX = -this._transform.x + layer.canvas.width * 0.5;
            let offsetY = -this._transform.y + layer.canvas.height * 0.5;
            this._layers[n].render(offsetX, offsetY);
        }
    }
}