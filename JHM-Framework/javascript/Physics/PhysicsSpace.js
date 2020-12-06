class PhysicsSpace extends CollisionSpace {
    constructor(loop) {
        super();
        this._rigidbodies = [];
        loop.onUpdate.add(this.Update, this);
    }
    Update(deltaTime) {
        this._rigidbodies.forEach((actor) => {
            actor.Update(deltaTime);
            actor.CheckCollision(this._colliders);
        });
    }
    AddRigidbody(rigidbody) {
        let index = this._rigidbodies.indexOf(rigidbody);
        if (index < 0) {
            this._rigidbodies.push(rigidbody);
        }
    }
    RemoveRigidbody(rigidbody) {
        let index = this._rigidbodies.indexOf(rigidbody);
        if (index < 0)
            return;
        this._rigidbodies.splice(index, 1);
    }
}
