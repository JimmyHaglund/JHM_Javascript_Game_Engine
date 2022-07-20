class CapricaPhysicsSpace {
    // private _rigidbodies: IRigidbody[] = [];
    private _actors: IPhysicsActor[] = [];
    private _collisionSpaces: CollisionSpace[];

    public get physicsActors(): IPhysicsActor[] {return this._actors}; 

    constructor(loop: ILoop, collisions: CollisionSpace[]) {
        // super();
        loop.onUpdate.add(this.update, this);
        this._collisionSpaces = collisions;
    }
    
    update(deltaTime: number) {
        this._actors.forEach((actor) => {
            this._collisionSpaces.forEach(space => {
                actor.checkCollision(space.colliders); 
            });
        });
    }
    
    public addPhysicsActor(actor: IPhysicsActor): void {
        let index = this._actors.indexOf(actor);
        if (index < 0) {
            this._actors.push(actor);
        }
    }

    public removePhysicsActor(actor: IPhysicsActor): void {
        let index = this._actors.indexOf(actor);
        if (index < 0) return;
        this._actors.splice(index, 1);
    }

    /*
    update(deltaTime: number) {
        this._rigidbodies.forEach((actor) => {
            actor.update(deltaTime);
            actor.checkCollision(this._colliders); 
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
    */
}