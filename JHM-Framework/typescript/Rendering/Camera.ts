class Camera implements IDestroyable {
    public onDestroy:Action = new Action();

    private _backgroundColor: string = "gray";
    private _transform: ITransform;
    private _layers: IRenderLayer[];
    private _canvas: HTMLCanvasElement;
    private _context: CanvasRenderingContext2D;
    private _frustumWidth: number;
    private _frustumHeight: number;

    public get centreX(): number { return this._transform.worldX; }
    public get centreY(): number { return this._transform.worldY; }
    public get canvas(): HTMLCanvasElement { return this._canvas; }
    public get viewFrustum(): Rect {
        return new Rect(
            this.centreX + this._frustumWidth * 0.5,
            this.centreX - this._frustumWidth * 0.5,
            this.centreY - this._frustumWidth * 0.5,
            this.centreY + this._frustumHeight * 0.5
        );
    }
    public get screenBounds(): Rect {
        return new Rect(
            parseInt(this._canvas.style.right, 10),
            parseInt(this._canvas.style.left, 10),
            parseInt(this._canvas.style.top, 10),
            parseInt(this._canvas.style.bottom, 10)
        );
    }

    constructor(layers: IRenderLayer[], transform: ITransform, loop: ILoop) {
        this._transform = transform;
        this._layers = layers;

        loop.onUpdate.add(this.render, this);
    }

    public destroy():void {
        this._canvas.remove();
    }

    public createCanvas(screenLeft:number, screenTop:number, width:number, height:number):HTMLCanvasElement {
        let canvas = document.createElement("canvas");
        this._context = canvas.getContext("2d");
        canvas.width = width;
        canvas.height = height;
        canvas.style.left = screenLeft.toString();
        canvas.style.top = screenTop.toString();
        return (this._canvas = canvas);
    }

    public addToDocument(){
        document.body.insertBefore(this._canvas, document.body.childNodes[0]);
    }

    public render() {
        this.paintBackground();
        for (let n = 0; n < this._layers.length; n++) {
            let layer = this._layers[n];
            let offsetX = this._transform.worldX - this.canvas.width * 0.5;
            let offsetY = this._transform.worldY - this.canvas.height * 0.5;
            this._layers[n].render(this._context, offsetX, offsetY, this.viewFrustum);
        }
    }

    public setBackgroundColor(color:string) {
        this._backgroundColor = color;
    }

    private paintBackground(): void {
        let wipe = ():void => {
            let screenBounds = this.screenBounds;
            this._context.clearRect(screenBounds.left, screenBounds.top, 
                this.canvas.width, this.canvas.height);
        }
        
        wipe();
        this._context.fillStyle = this._backgroundColor;
        this._context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}