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
        this.onDestroy.invoke;
    }
    addComponent(component, id) {
        this._components.push({ component: component, id: id });
    }
    removeComponent(component) {
        let index = this._components.indexOf(component);
        if (index == -1)
            return;
        this._components.splice(index, 1);
    }
    getComponent(type) {
        for (let n = 0; n < this._components.length; n++) {
            if (type.Implements(this._components[n].id)) {
                return this._components[n].component;
            }
        }
        return null;
    }
    get x() { return this._transform.x; }
    set x(value) { this._transform.x = value; }
    get y() { return this._transform.y; }
    set y(value) { this._transform.y = value; }
    get worldX() { return this._transform.worldX; }
    set worldX(value) { this._transform.worldX = value; }
    get worldY() { return this._transform.worldY; }
    set worldY(value) { this._transform.worldY = value; }
    get rotation() { return this._transform.rotation; }
    set rotation(value) { this._transform.rotation = value; }
    get parent() { return this._transform.parent; }
    set parent(value) { this._transform.parent = value; }
}
