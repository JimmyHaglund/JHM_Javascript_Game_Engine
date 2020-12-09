class PhysicsSpace extends CollisionSpace {
    private _rigidbodies: IRigidbody[] = [];

    constructor(loop: ILoop) {
        super();
        loop.onUpdate.add(this.update, this);
    }

    update(deltaTime: number) {
        this._rigidbodies.forEach((actor) => {
            actor.Update(deltaTime);
           actor.CheckCollision(this._colliders); 
        });
    }
   
    addRigidbody(rigidbody:IRigidbody) {
        let index = this._rigidbodies.indexOf(rigidbody);
        if (index < 0) {
            this._rigidbodies.push(rigidbody);
        }
    }
    
    removeRigidbody(rigidbody:IRigidbody) {
        let index = this._rigidbodies.indexOf(rigidbody);
        if (index < 0) return;
        this._rigidbodies.splice(index, 1);
    }
}