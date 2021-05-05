class PhysicsSpace {
    constructor(loop, collisions) {
        // private _rigidbodies: IRigidbody[] = [];
        this._actors = [];
        // super();
        loop.onUpdate.add(this.update, this);
        this._collisionSpaces = collisions;
    }
    get physicsActors() { return this._actors; }
    ;
    update(deltaTime) {
        this._actors.forEach((actor) => {
            this._collisionSpaces.forEach(space => {
                actor.checkCollision(space.colliders);
            });
        });
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
}
