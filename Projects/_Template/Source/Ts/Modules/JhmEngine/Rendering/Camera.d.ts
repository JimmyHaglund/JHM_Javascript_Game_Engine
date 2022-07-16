declare class Camera implements IDestroyable {
    private _backgroundColor;
    private _transform;
    private _layers;
    private _canvas;
    private _context;
    private _mousePosition;
    private _onDestroy;
    get onDestroy(): Action;
    get centreX(): number;
    get centreY(): number;
    get canvas(): HTMLCanvasElement;
    get viewFrustum(): Rect;
    get screenBounds(): Rect;
    constructor(layers: IRenderLayer[], transform: ITransform, loop: ILoop);
    destroy(): void;
    setCanvas(canvas: HTMLCanvasElement): void;
    printCanvasProperties(): void;
    render(): void;
    setBackgroundColor(color: string): void;
    getMouseWorldPosition(): {
        x: number;
        y: number;
    };
    static createCanvas(screenLeft: number, screenTop: number, width: number, height: number, positioning: string): HTMLCanvasElement;
    private getMouseCanvasPosition;
    private storeMousePosition;
    private paintBackground;
}
