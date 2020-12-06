class RotatedSprite extends Sprite {
    private _rotation: number = 3.14 * 0.25;

    public set Rotation(value: number) { this._rotation = value; }
    public get Rotation(): number { return this._rotation; }

    protected applyContextSettings(renderContext: CanvasRenderingContext2D): { reset(): void } {
        let contextAlpha = renderContext.globalAlpha;
        let translation = this.getTranslation();
        let rotation = this._rotation;

        renderContext.globalAlpha = this._alpha;
        renderContext.translate(translation.x, translation.y);
        renderContext.rotate(rotation);

        return {
            reset() {
                renderContext.globalAlpha = contextAlpha;
                renderContext.rotate(-rotation);
                renderContext.translate(-translation.x, -translation.y);
            }
        };
    }
}