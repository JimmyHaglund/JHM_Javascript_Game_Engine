class LayeredSprite {
    constructor(loop, legLayer, armLayer, torsoLayer, movementController) {
        this._layers = [];
        this._walkCycleTime = 0.25;
        this._timeSinceLastStep = 0;
        this._legsVisible = false;
        this._legLayer = legLayer;
        this._armLayer = armLayer;
        this._torsoLayer = torsoLayer;
        this._loop = loop;
        loop.onUpdate.add(this.update, this);
        this._movementController = movementController;
    }
    get moving() { return this._movementController.moving; }
    static generateSprites(transform, legAId, legBId, armDownId, armUpId, torsoId) {
        let ids = {
            legA: legAId,
            legB: legBId,
            armDown: armDownId,
            armUp: armUpId,
            torso: torsoId
        };
        let legA = new RotatedSprite(transform, ids.legA);
        let legB = new RotatedSprite(transform, ids.legB);
        let armDown = new RotatedSprite(transform, ids.armDown);
        let armUp = new RotatedSprite(transform, ids.armUp);
        let torso = new RotatedSprite(transform, ids.torso);
        return {
            legA: legA,
            legB: legB,
            armDown: armDown,
            armUp: armUp,
            torso: torso
        };
    }
    withLegs(walk1, walk2) {
        walk1.offsetX = -32;
        walk1.offsetY = -32;
        walk2.offsetX = -32;
        walk2.offsetY = -32;
        this._legWalk1 = walk1;
        this._legWalk2 = walk2;
        this._currentLegSprite = this._legWalk1;
        this._legLayer.addRenderable(this._currentLegSprite);
        return this;
    }
    withTorso(torso) {
        torso.offsetX = -32;
        torso.offsetY = -32;
        this._torso = torso;
        this._torsoLayer.addRenderable(this._torso);
        return this;
    }
    withArms(armsDown, armsAiming) {
        armsDown.offsetX = -32;
        armsDown.offsetY = -32;
        armsAiming.offsetX = -32;
        armsAiming.offsetY = -32;
        this._armsDown = armsDown;
        this._armsAiming = armsAiming;
        this._armLayer.addRenderable(this._armsDown);
        return this;
    }
    startAim() {
        this._armLayer.removeRenderable(this._armsDown);
        this._armLayer.addRenderable(this._armsAiming);
    }
    endAim() {
        this._armLayer.removeRenderable(this._armsAiming);
        this._armLayer.addRenderable(this._armsDown);
    }
    update(deltaTime) {
        if (!this.moving) {
            this.hideLegs();
            return;
        }
        this._timeSinceLastStep += deltaTime;
        if (this._timeSinceLastStep > this._walkCycleTime) {
            this._timeSinceLastStep = 0;
            this.swapLegs();
        }
        // console.log("Time since last step: ", this._timeSinceLastStep);
    }
    swapLegs() {
        this._legLayer.removeRenderable(this._currentLegSprite);
        if (this._currentLegSprite == this._legWalk1) {
            this._currentLegSprite = this._legWalk2;
        }
        else {
            this._currentLegSprite = this._legWalk1;
        }
        this._legLayer.addRenderable(this._currentLegSprite);
    }
    hideLegs() {
        if (this._currentLegSprite == null)
            return;
        this._legLayer.removeRenderable(this._currentLegSprite);
        this._currentLegSprite = null;
        // this._legsVisible = false;
    }
    showLegs() {
        if (this._legsVisible)
            return;
        this._legLayer.addRenderable(this._currentLegSprite);
        this._legsVisible = true;
    }
}
