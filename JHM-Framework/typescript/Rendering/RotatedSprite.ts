class RotatedSprite extends Sprite {
    // private _rotation: number = 3.14 * 0.25;
    public get Rotation(): number { return this._transform.rotation; }

    public Render(context: CanvasRenderingContext2D) {
        let contextSettings = {
            contextAlpha: context.globalAlpha,
            translation: this.Translation,
            rotation: -this.Rotation,
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
        this.DrawSprite(context);
        contextSettings.reset();
    }
}