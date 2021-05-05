class RenderLayer {
    constructor(label = "background") {
        this._renderables = [];
    }
    addRenderable(renderable) {
        this._renderables.push(renderable);
    }
    removeRenderable(renderable) {
        let index = this._renderables.indexOf(renderable);
        if (index == -1)
            return;
        this._renderables.splice(index, 1);
    }
    render(context, offsetX, offsetY, viewRect) {
        this._renderables.forEach((renderable) => {
            renderable.render(context, offsetX, offsetY);
        });
    }
}
