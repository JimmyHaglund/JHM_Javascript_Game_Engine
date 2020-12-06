class CollisionSpace {
    constructor() {
        this._colliders = [];
    }
    AddCollider(collider) {
        let index = this._colliders.indexOf(collider);
        if (index >= 0)
            return;
        collider.onDestroy.add(() => {
            this.RemoveCollider(collider);
        }, this);
        this._colliders.push(collider);
    }
    RemoveCollider(collider) {
        let index = this._colliders.indexOf(collider);
        if (index < 0)
            return;
        this._colliders.splice(index, 1);
    }
    GetColliders() {
        return this._colliders.slice(0);
    }
}
