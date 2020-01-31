const iDestroyable = Symbol("IDestroyable");
// Implements: destroy() & isDestroyed

const Entity = function (positionX = 0, positionY = 0, originX = 0, originY = 0) {
    let _components = [];

    let _transform = new Transform(positionX, positionY, originX, originY, 0);

    let _iDestroyable = {
        destroy: function () {
            _components.forEach((component) => {
                component[iDestroyable].destroy();
            });
        }
    }

    class entity {
        constructor() { }
        get transform() { return _transform; }
        get components() { return _components; }
        get [iDestroyable]() { return iDestroyable }
        destroy() {
            _iDestroyable.destroy();
        }
        addComponent(component){
            if (_components.indexOf(component) != -1) return;
            _components.push(component);
        }
    }
    let _entity = new entity();
    return _entity;
}