class RotatedSprite extends Sprite {
    constructor() {
        super(...arguments);
        this._rotation = 3.14 * 0.25;
    }
    applyContextSettings(renderContext) {
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
