class CollisionSpace {
    protected _colliders: ICollider[] = [];
    
    public AddCollider(collider: ICollider): void {
        let index = this._colliders.indexOf(collider);
        if (index >= 0) return;
        collider.onDestroy.add(() => {
            this.RemoveCollider(collider);
        }, this);
        this._colliders.push(collider);
    }
    public RemoveCollider(collider): void {
        let index = this._colliders.indexOf(collider);
        if (index < 0) return;
        this._colliders.splice(index, 1);
    }
    public GetColliders(): ICollider[] {
        return this._colliders.slice(0);
    }
}