class PhysicsSpace {
    constructor(loop) {
        loop.onUpdate.add(this.update);
    }
    update(deltaTime) {
        this._actors.forEach((actor) => {
            actor.checkCollision(this._colliders);
        });
    }
    addCollider(collider) {
        let index = this._colliders.indexOf(collider);
        if (index < 0)
            return;
        collider.onDestroy.add(() => {
            this.removeCollider(collider);
        });
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
    addPhysicsActor(actor) {
        let index = this._actors.indexOf(actor);
        if (index < 0) {
            this._actors.push(actor);
        }
    }
    removePhysicsActor(actor) {
        let index = this._actors.indexOf(actor);
        if (index < 0)
            return;
        this._actors.splice(index, 1);
    }
    getPhysicsActors() {
        return this._actors.slice[0];
    }
}
