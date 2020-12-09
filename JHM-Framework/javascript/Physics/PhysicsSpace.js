class PhysicsSpace extends CollisionSpace {
    constructor(loop) {
        super();
        this._rigidbodies = [];
        loop.onUpdate.add(this.update, this);
    }
    update(deltaTime) {
        this._rigidbodies.forEach((actor) => {
            actor.update(deltaTime);
            actor.checkCollision(this._colliders);
        });
    }
    addRigidbody(rigidbody) {
        let index = this._rigidbodies.indexOf(rigidbody);
        if (index < 0) {
            this._rigidbodies.push(rigidbody);
        }
    }
    removeRigidbody(rigidbody) {
        let index = this._rigidbodies.indexOf(rigidbody);
        if (index < 0)
            return;
        this._rigidbodies.splice(index, 1);
    }
}
