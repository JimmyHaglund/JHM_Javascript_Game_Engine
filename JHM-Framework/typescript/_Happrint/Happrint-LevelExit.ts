class LevelExit implements IPhysicsSpace, IDestroyable {

    private _collider: ICollider = null;
    private _walkers: WalkingCharacter[];
    private _onDestroy: Action = new Action();
    private _walkersEmpty: Action = new Action();

    get onDestroy(): Action { return this._onDestroy; }
    get onWalkersEmpty(): Action { return this._walkersEmpty; }

    constructor(loop: ILoop, walkers: WalkingCharacter[], renderSpace: RenderSpace) {
        let myCollider = new VisibleBoxCollider(25, 200, 500, 50, renderSpace, this);
        this._onDestroy.add(myCollider.entity.destroy, myCollider.entity);
        loop.onUpdate.add(this.update, this);
        this._walkers = walkers;
    }
    destroy() {
        this.onDestroy.invoke();
    }
    update(deltaTime: number): void {
        for (let n = 0; n < this._walkers.length; n++) {
            let walker = this._walkers[n];
            let x = walker.entity.transform.x;
            let y = walker.entity.transform.y;
            if (this._collider.overlapsPoint(x, y)) {
                walker.shouldMove = false;
                console.log("Walker overlaps exit!");
                console.log(this._walkers);
                this._walkers.splice(n, 1);
                console.log(this._walkers);
                if (this._walkers.length == 0){
                    console.log("WALKERSSS EMMPTTYTYY");
                    this.onWalkersEmpty.invoke.call(this.onWalkersEmpty);
                }
            }
        }
    }
    addCollider(collider: ICollider): void {
        this._collider = collider;
    }
    removeCollider(collider: ICollider): void {
        this._collider = null;
    }
    getColliders(): ICollider[] {
        return [this._collider];
    }
    addPhysicsActor(actor: IPhysicsActor): void { }
    removePhysicsActor(actor: IPhysicsActor): void { }
    getPhysicsActors(): IPhysicsActor[] { return this._walkers; }
}