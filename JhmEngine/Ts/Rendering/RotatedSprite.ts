// Dependencies: Sprite
class RotatedSprite extends Sprite {
    public get rotation(): number { return this._transform.rotation; }

    public render(context: CanvasRenderingContext2D, viewX:number, viewY:number) {
        let translationX = this.translation.x - viewX;
        let translationY = this.translation.y - viewY;
        let contextSettings = {
            contextAlpha: context.globalAlpha,
            translation: { x:translationX, y:translationY },
            rotation: -this.rotation,
            apply: function () {
                context.globalAlpha = this._alpha;
                context.translate(contextSettings.translation.x, contextSettings.translation.y);
                context.rotate(contextSettings.rotation);
            },
            reset: function () {
                context.globalAlpha = contextSettings.contextAlpha;
                context.rotate(-contextSettings.rotation);
                context.translate(-contextSettings.translation.x, -contextSettings.translation.y);
            }
        }
        contextSettings.apply();
        this.drawSprite(context);
        contextSettings.reset();
    }
}