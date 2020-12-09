<<<<<<< HEAD
class PhysicsSpace extends CollisionSpace {
    private _rigidbodies: IRigidbody[] = [];

=======
class PhysicsSpace implements IPhysicsSpace {
    private _actors: IPhysicsActor[] = [];
    private _colliders: ICollider[] = [];
    private _loopActionId = -1;
>>>>>>> 82fad0a36f197f179401c4fc2121d251ac1ca65f
    constructor(loop: ILoop) {
        super();
        loop.onUpdate.add(this.Update, this);
    }
<<<<<<< HEAD

    Update(deltaTime: number) {
        this._rigidbodies.forEach((actor) => {
            actor.Update(deltaTime);
           actor.CheckCollision(this._colliders); 
        });
    }
   
    AddRigidbody(rigidbody:IRigidbody) {
        let index = this._rigidbodies.indexOf(rigidbody);
=======
    update(deltaTime: number): void {
        this._actors.forEach((actor) => {
           actor.checkCollision(this._colliders); 
        });
    }
    addCollider(collider: ICollider): void {
        let index = this._colliders.indexOf(collider);
        if (index >= 0) return;
        collider.onDestroy.add(() => {
            this.removeCollider(collider);
        }, this);
        this._colliders.push(collider);
    }
    removeCollider(collider: ICollider): void {
        let index = this._colliders.indexOf(collider);
        if (index < 0) return;
        this._colliders.splice(index, 1);
    }
    getColliders(): ICollider[] {
        return this._colliders.slice(0);
    }

    addPhysicsActor(actor: IPhysicsActor): void {
        let index = this._actors.indexOf(actor);
>>>>>>> 82fad0a36f197f179401c4fc2121d251ac1ca65f
        if (index < 0) {
            this._rigidbodies.push(rigidbody);
        }
    }
<<<<<<< HEAD
    
    RemoveRigidbody(rigidbody:IRigidbody) {
        let index = this._rigidbodies.indexOf(rigidbody);
        if (index < 0) return;
        this._rigidbodies.splice(index, 1);
=======
    removePhysicsActor(actor: IPhysicsActor): void {
        let index = this._actors.indexOf(actor);
        if (index < 0) return;
        this._actors.splice(index, 1);
    }
    getPhysicsActors(): IPhysicsActor[] {
        return this._actors.slice(0);
>>>>>>> 82fad0a36f197f179401c4fc2121d251ac1ca65f
    }
}