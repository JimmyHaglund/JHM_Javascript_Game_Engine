class LevelExit {
    constructor(loop, walkers, renderSpace) {
        this._collider = null;
        this._onDestroy = new Action();
        this._walkersEmpty = new Action();
        let myCollider = new VisibleBoxCollider(250, 200, 25, 25, renderSpace, this);
        this._onDestroy.add(myCollider.entity.destroy, myCollider.entity);
        loop.onUpdate.add(this.update, this);
        this._walkers = walkers;
    }
    get onDestroy() { return this._onDestroy; }
    get onWalkersEmpty() { return this._walkersEmpty; }
    destroy() {
        this.onDestroy.invoke();
    }
    update(deltaTime) {
        for (let n = 0; n < this._walkers.length; n++) {
            let walker = this._walkers[n];
            let x = walker.entity.transform.x;
            let y = walker.entity.transform.y;
            if (this._collider.overlapsPoint(x, y)) {
                walker.shouldMove = false;
                console.log(this._walkers);
                this._walkers.splice(n, 1);
                console.log(this._walkers);
                if (this._walkers.length == 0) {
                    this.onWalkersEmpty.invoke.call(this.onWalkersEmpty);
                }
            }
        }
    }
    addCollider(collider) {
        this._collider = collider;
    }
    removeCollider(collider) {
        this._collider = null;
    }
    getColliders() {
        return [this._collider];
    }
    addPhysicsActor(actor) { }
    removePhysicsActor(actor) { }
    getPhysicsActors() { return this._walkers; }
}
