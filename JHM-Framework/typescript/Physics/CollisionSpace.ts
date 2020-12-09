class CollisionSpace {
    protected _colliders: ICollider[] = [];
    
    public addCollider(collider: ICollider): void {
        let index = this._colliders.indexOf(collider);
        if (index >= 0) return;
        collider.onDestroy.add(() => {
            this.removeCollider(collider);
        }, this);
        this._colliders.push(collider);
    }
    public removeCollider(collider): void {
        let index = this._colliders.indexOf(collider);
        if (index < 0) return;
        this._colliders.splice(index, 1);
    }
    public getColliders(): ICollider[] {
        return this._colliders.slice(0);
    }
}