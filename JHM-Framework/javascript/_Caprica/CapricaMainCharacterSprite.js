class CapricaMainCharacterSprite {
    constructor(loop, legLayer, armLayer, torsoLayer) {
        this._walkCycleTime = 0.25;
        this._timeSinceLastStep = 0;
        this._legLayer = legLayer;
        this._armLayer = armLayer;
        this._torsoLayer = torsoLayer;
        this._loop = loop;
        loop.onUpdate.add(this.update, this);
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
}
