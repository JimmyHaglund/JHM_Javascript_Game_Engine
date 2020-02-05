class Entity {
    constructor(positionX = 0, positionY = 0) {
        this._transform = new Transform();
        this._components = [];
        this._onDestroy = new Action();
        this._transform.x = positionX;
        this._transform.y = positionY;
    }
    get onDestroy() { return this._onDestroy; }
    get transform() { return this._transform; }
    get components() { return this._components; }
    destroy() {
        this._components.forEach((component) => {
            component.destroy();
        });
        this.onDestroy.invoke;
    }
    addComponent(component) {
        if (this._components.indexOf(component) != -1)
            return;
        this._components.push(component);
    }
    removeComponent(component) {
        let index = this._components.indexOf(component);
        if (index == -1)
            return;
        this._components.splice(index, 1);
    }
}
