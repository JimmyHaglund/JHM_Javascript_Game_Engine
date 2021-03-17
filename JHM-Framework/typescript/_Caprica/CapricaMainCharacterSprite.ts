class CapricaMainCharacterSprite {
    private _legWalk1: RotatedSprite;
    private _legWalk2: RotatedSprite;
    private _torso: RotatedSprite;
    private _armsDown: RotatedSprite;
    private _armsAiming: RotatedSprite;
    private _legLayer: IRenderLayer;
    private _armLayer: IRenderLayer;
    private _torsoLayer: IRenderLayer;
    private _loop: ILoop;
    private _entity: Entity;

    private _walkCycleTime: number = 0.25;
    private _timeSinceLastStep: number = 0;
    private _currentLegSprite: RotatedSprite;

    constructor(loop: ILoop, legLayer: IRenderLayer, armLayer: IRenderLayer, torsoLayer: IRenderLayer) {
        this._legLayer = legLayer;
        this._armLayer = armLayer;
        this._torsoLayer = torsoLayer;
        this._loop = loop;
        loop.onUpdate.add(this.update, this);
    }

    public withLegs(walk1: RotatedSprite, walk2: RotatedSprite): CapricaMainCharacterSprite {
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

    public withTorso(torso: RotatedSprite): CapricaMainCharacterSprite {
        torso.offsetX = -32;
        torso.offsetY = -32;
        this._torso = torso;
        this._torsoLayer.addRenderable(this._torso);
        return this;
    }

    public withArms(armsDown: RotatedSprite, armsAiming: RotatedSprite): CapricaMainCharacterSprite {
        armsDown.offsetX = -32;
        armsDown.offsetY = -32;
        armsAiming.offsetX = -32;
        armsAiming.offsetY = -32;
        this._armsDown = armsDown;
        this._armsAiming = armsAiming;
        this._armLayer.addRenderable(this._armsDown);
        return this;
    }

    public startAim(): void {
        this._armLayer.removeRenderable(this._armsDown);
        this._armLayer.addRenderable(this._armsAiming);
    }

    public endAim(): void {
        this._armLayer.removeRenderable(this._armsAiming);
        this._armLayer.addRenderable(this._armsDown);
    }

    public update(deltaTime: number): void {
        this._timeSinceLastStep += deltaTime;
        if (this._timeSinceLastStep > this._walkCycleTime) {
            this._timeSinceLastStep = 0;
            this.swapLegs();
        }
        // console.log("Time since last step: ", this._timeSinceLastStep);
    }

    private swapLegs(): void {
        this._legLayer.removeRenderable(this._currentLegSprite);
        if (this._currentLegSprite == this._legWalk1) {
            this._currentLegSprite = this._legWalk2;
        } else {
            this._currentLegSprite = this._legWalk1;
        }
        this._legLayer.addRenderable(this._currentLegSprite);
    }
}