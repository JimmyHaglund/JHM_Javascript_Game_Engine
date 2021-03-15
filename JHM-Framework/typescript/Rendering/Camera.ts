class Camera implements IDestroyable {
    public onDestroy:Action = new Action();

    private _backgroundColor: string = "gray";
    private _transform: ITransform;
    private _layers: IRenderLayer[];
    private _canvas: HTMLCanvasElement;
    private _context: CanvasRenderingContext2D;
    private _mousePosition = {x:0, y:0};

    public get centreX(): number { return this._transform.worldX; }
    public get centreY(): number { return this._transform.worldY; }
    public get canvas(): HTMLCanvasElement { return this._canvas; }
    public get viewFrustum(): Rect {
        return new Rect(
            this.centreX - this.canvas.width * 0.5,
            this.centreY - this.canvas.height * 0.5,
            this.canvas.width,
            this.canvas.height
        );
    }
    public get screenBounds(): Rect {
        let left = parseInt(this._canvas.style.left, 10);
        let top = parseInt(this._canvas.style.top, 10);
        let right = left + this.canvas.width;
        let bottom = top + this.canvas.height;
        return new Rect(
            left,
            top,
            right - left,
            bottom - top
        );
    }

    constructor(layers: IRenderLayer[], transform: ITransform, loop: ILoop) {
        this._transform = transform;
        this._layers = layers;

        loop.onUpdate.add(this.render, this);
        onMouseMoved.add(this.storeMousePosition, this);
    }

    public destroy():void {
        this._canvas.remove();
    }

    public createCanvas(screenLeft:number, screenTop:number, width:number, height:number):HTMLCanvasElement {
        let canvas = document.createElement("canvas");
        canvas.style.position = 'absolute';
        this._context = canvas.getContext("2d");
        canvas.width = width;
        canvas.height = height;
        canvas.style.left = screenLeft.toString() + "px";
        canvas.style.top = screenTop.toString() + "px";
        return (this._canvas = canvas);
    }

    public addToDocument(){
        document.body.insertBefore(this._canvas, document.body.childNodes[0]);
    }

    public render() {
        this.paintBackground();
        for (let n = 0; n < this._layers.length; n++) {
            let offsetX = this._transform.worldX - this.canvas.width * 0.5;
            let offsetY = this._transform.worldY - this.canvas.height * 0.5;
            this._layers[n].render(this._context, offsetX, offsetY, this.viewFrustum);
        }
    }

    public setBackgroundColor(color:string) {
        this._backgroundColor = color;
    }

    public getMouseWorldPosition(): { x: number, y: number } {
        let cameraWorldRect = this.viewFrustum;
        let mouseCanvasPosition = this.getMouseCanvasPosition();
        let mouseWorldX = mouseCanvasPosition.x + cameraWorldRect.left;
        let mouseWorldY = mouseCanvasPosition.y + cameraWorldRect.top;
        return {
            x: mouseWorldX,
            y: mouseWorldY
        };
    }

    private getMouseCanvasPosition(): { x: number, y: number } {
        let cameraScreenRect = this.screenBounds;
        let mouseCanvasX = this._mousePosition.x - cameraScreenRect.left;
        let mouseCanvasY = this._mousePosition.y - cameraScreenRect.top;
        return {
            x: mouseCanvasX,
            y: mouseCanvasY
        };
    }

    private storeMousePosition(event:MouseEvent) {
        this._mousePosition = {x:event.x, y:event.y}
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