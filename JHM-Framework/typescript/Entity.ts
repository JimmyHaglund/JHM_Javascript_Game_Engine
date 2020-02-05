class Entity implements IDestroyable {
    private _transform: Transform = new Transform();
    private _components: IDestroyable[] = [];
    private _onDestroy: Action = new Action();

    get onDestroy() { return this._onDestroy; }
    get transform() { return this._transform; }
    get components() { return this._components; }

    constructor(positionX = 0, positionY = 0, originX = 0, originY = 0) {
    }
    destroy(): void {
        this._components.forEach((component) => {
            component.destroy();
        });
    }
    addComponent(component): void {
        if (this._components.indexOf(component) != -1) return;
        this._components.push(component);
    }
}