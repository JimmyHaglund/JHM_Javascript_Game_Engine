class Entity {
    constructor(positionX = 0, positionY = 0, originX = 0, originY = 0) {
        this._transform = new Transform();
        this._components = [];
        this._onDestroy = new Action();
    }
    get onDestroy() { return this._onDestroy; }
    get transform() { return this._transform; }
    get components() { return this._components; }
    destroy() {
        this._components.forEach((component) => {
            component.destroy();
        });
    }
    addComponent(component) {
        if (this._components.indexOf(component) != -1)
            return;
        this._components.push(component);
    }
}
