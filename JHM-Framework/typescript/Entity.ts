class Entity implements IDestroyable {
    private _transform: Transform = new Transform();
    private _components: IComponent[] = [];
    private _onDestroy: Action = new Action();

    get onDestroy() { return this._onDestroy; }
    get transform() { return this._transform; }
    get components() { return this._components; }

    constructor(positionX = 0, positionY = 0) {
        this._transform.x = positionX;
        this._transform.y = positionY;
    }
    destroy(): void {
        this._components.forEach((component) => {
            component.destroy();
        });
        this.onDestroy.invoke;
    }
    addComponent(component: IComponent): void {
        if (this._components.indexOf(component) != -1) return;
        this._components.push(component);
    }
    removeComponent(component: IComponent): void {
        let index = this._components.indexOf(component);
        if (index == -1) return;
        this._components.splice(index, 1);
    }
}