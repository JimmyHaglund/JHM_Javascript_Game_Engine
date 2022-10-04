class StatefulSprite {
    private _sprites: Sprite[][]= [];
    private _loop: ILoop;
    private _entity: Entity;

    private _walkCycleTime: number = 0.25;
    private _timeSinceLastStep: number = 0;
    private _currentLegSprite: RotatedSprite;
    private _movementController: CapricaMovementController;
    private _legsVisible: boolean = false;
    private get moving(): boolean { return this._movementController.moving; }
    
    constructor(loop: ILoop, legLayer: IRenderLayer, armLayer: IRenderLayer, torsoLayer: IRenderLayer, movementController: CapricaMovementController) {
        this._loop = loop;
        loop.onUpdate.add(this.update, this);
        this._movementController = movementController;
    }

    public static generateSprites(
        transform:Transform,
        legAId:string,
        legBId:string,
        armDownId:string,
        armUpId:string,
        torsoId:string) : {legA:RotatedSprite, legB:RotatedSprite, armDown:RotatedSprite, armUp:RotatedSprite, torso:RotatedSprite}{
        let ids = {
            legA: legAId,
            legB: legBId,
            armDown: armDownId,
            armUp: armUpId,
            torso: torsoId
        }
        let legA = new RotatedSprite(transform, ids.legA);
        let legB = new RotatedSprite(transform, ids.legB);
        let armDown = new RotatedSprite(transform, ids.armDown)
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

    public withLegs(walk1: RotatedSprite, walk2: RotatedSprite): CapricaCharacterSprite {
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

    public withTorso(torso: RotatedSprite): CapricaCharacterSprite {
        torso.offsetX = -32;
        torso.offsetY = -32;
        this._torso = torso;
        this._torsoLayer.addRenderable(this._torso);
        return this;
    }

    public withArms(armsDown: RotatedSprite, armsAiming: RotatedSprite): CapricaCharacterSprite {
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

    private swapLegs(): void {
        this._legLayer.removeRenderable(this._currentLegSprite);
        if (this._currentLegSprite == this._legWalk1) {
            this._currentLegSprite = this._legWalk2;
        } else {
            this._currentLegSprite = this._legWalk1;
        }
        this._legLayer.addRenderable(this._currentLegSprite);
    }

    private hideLegs(): void {
        if (this._currentLegSprite == null) return;
        this._legLayer.removeRenderable(this._currentLegSprite);
        this._currentLegSprite = null;
        // this._legsVisible = false;
    }

    private showLegs(): void {
        if (this._legsVisible) return;
        this._legLayer.addRenderable(this._currentLegSprite);
        this._legsVisible = true;
    }
}