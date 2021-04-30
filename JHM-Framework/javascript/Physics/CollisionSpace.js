class CollisionSpace {
    constructor() {
        this._colliders = [];
    }
    get colliders() { return this._colliders; }
    ;
    addCollider(collider) {
        let index = this._colliders.indexOf(collider);
        if (index >= 0)
            return;
        collider.onDestroy.add(() => {
            this.removeCollider(collider);
        }, this);
        this._colliders.push(collider);
    }
    removeCollider(collider) {
        let index = this._colliders.indexOf(collider);
        if (index < 0)
            return;
        this._colliders.splice(index, 1);
    }
    getColliders() {
        return this._colliders.slice(0);
    }
}
