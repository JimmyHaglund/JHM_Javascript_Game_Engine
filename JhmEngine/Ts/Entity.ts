class Entity implements IDestroyable, ITransform {
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
        this.onDestroy.invoke;
    }
    
    addComponent(component: IComponent): void {
        this._components.push(component);
    }

    removeComponent(component: IComponent): void {
        let index = this._components.indexOf(component);
        if (index == -1) return;
        this._components.splice(index, 1);
    }

    getComponent<T>(type: ClassId): T {
        for(let n = 0; n < this._components.length; n++) {
            if (type.Implements(this._components[n].id)) {
                return this._components[n].component as T;
            }
        }
        return null;
    }
    
    get x(): number { return this._transform.x; }
    set x(value: number) { this._transform.x = value; }
    get y(): number { return this._transform.y; }
    set y(value: number) { this._transform.y = value; }

    get worldX(): number { return this._transform.worldX; }
    set worldX(value: number) { this._transform.worldX = value; }
    get worldY(): number { return this._transform.worldY; }
    set worldY(value: number) { this._transform.worldY = value; }

    get rotation(): number { return this._transform.rotation; }
    set rotation(value: number) { this._transform.rotation = value; }
    get parent(): Transform { return this._transform.parent; }
    set parent(value: Transform) { this._transform.parent = value; }
}