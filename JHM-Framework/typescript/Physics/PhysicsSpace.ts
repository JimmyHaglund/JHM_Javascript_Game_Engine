class PhysicsSpace {
    private _actors: IPhysicsActor[] = [];
    private _colliders: ICollider[] = [];
    private _loopActionId = -1;
    constructor(loop: Loop) {
        this._loopActionId = loop.onUpdate.add(this.update, this);
    }
    update(deltaTime: number) {
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
    removeCollider(collider): void {
        let index = this._colliders.indexOf(collider);
        if (index < 0) return;
        this._colliders.splice(index, 1);
    }
    getColliders(): ICollider[] {
        return this._colliders.slice(0);
    }

    addPhysicsActor(actor: IPhysicsActor) {
        let index = this._actors.indexOf(actor);
        if (index < 0) {
            this._actors.push(actor);
        }
    }
    removePhysicsActor(actor) {
        let index = this._actors.indexOf(actor);
        if (index < 0) return;
        this._actors.splice(index, 1);
    }
    getPhysicsActors() {
        return this._actors.slice(0);
    }
}