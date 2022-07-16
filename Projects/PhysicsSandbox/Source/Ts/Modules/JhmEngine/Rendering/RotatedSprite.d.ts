declare class RotatedSprite extends Sprite {
    get rotation(): number;
    render(context: CanvasRenderingContext2D, viewX: number, viewY: number): void;
}
