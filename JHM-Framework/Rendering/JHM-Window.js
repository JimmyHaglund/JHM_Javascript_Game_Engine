/**
 * @constructor Window
 * @description Rendering window. Renders attached RenderComponents to a canvas of a given size, relative to local window space.
 * @param {*} originX Left-side position of window
 * @param {*} originY Bottom position of window
 * @param {*} width 
 * @param {*} height 
 * @param {*} backgroundColor 
 */
const Window = function (left, top, width, height, loop, backgroundColor = "#B6B6B4") {
    let _originX = left;
    let _originY = top + height;
    let _rotation = 0;
    let _width = width;
    let _height = height;
    let _loop = loop;
    let _color = backgroundColor;

    let _renderables = new Map();
    let _canvas = document.createElement("canvas");
    let _renderContext = _canvas.getContext("2d");
    class Bounds {
        get left() {
            return _originX;
        }
        get right() {
            return _originX + _width;
        }
        get top() {
            return _originY - height;
        }
        get bottom() {
            return _originY;
        }
    }
    let _bounds = new Bounds();

    class window {
        constructor() {
            _canvas.width = width;
            _canvas.height = height;
            _canvas.style.left = _bounds.left;
            _canvas.style.top = _bounds.top;
            document.body.insertBefore(_canvas, document.body.childNodes[0]);

            _loop.update.add(render);
        }
        addRenderComponent(component) {
            let layerKey = component.layer.toString();
            let layer = _renderables.get(layerKey);
            component.onDestroy.add(()=>this.removeRenderComponent(component));
            if (layer == undefined) {
                layer = [];
                _renderables.set(layerKey, layer);
            }
            if (layer.indexOf(component) != -1) return;
            layer.push(component);
        }
        removeRenderComponent(component) {
            let layerKey = component.layer.toString();
            let layer = _renderables.get(layerKey);
            if (layer == undefined) return;
            let index = layer.indexOf(component);
            if (index == -1) return null;
            layer.shift(index, 0);
        }
        setBackgroundColor(color) {
            _color = color;
        }
        get bounds() {
            return _bounds;
        }
        get canvas() {
            return _canvas;
        }
        wipe(){
            _renderContext.clearRect(_bounds.left, _bounds.top, _width, _height);
            _loop.update.remove(render);
        }
    }
    return new window();

    function render(deltaTime) {
        // console.log("render array length: " + renderArray.length);
        // console.log("Rendering");
        clear();
        _renderables.forEach((layer) => {
            layer.forEach((renderable) => {
                renderable.render(_originX, _originY, _rotation);
            });
        });
    }

    function clear() {
        _renderContext.clearRect(_bounds.left, _bounds.top, _width, _height);
        _renderContext.fillStyle = _color;
        _renderContext.fillRect( _bounds.left, _bounds.top, _width, _height);
    }
}