class Gun {
    private _onFire = new Action();
    private _onTakeAim = new Action();
    private _onStopAim = new Action();
    private _aim: AimController;
    private _shakerMaker: ShakerMaker;
    private _shootAudio: AudioComponent;
    private _takeAimAudio: AudioComponent;

    public get onFire(): Action { return this._onFire; }
    public get onTakeAim(): Action { return this._onTakeAim; }
    public get onStopAim(): Action { return this._onStopAim; }

    constructor(aim: AimController, shakerMaker: ShakerMaker) {
        this._aim = aim;
        this._shakerMaker = shakerMaker;
        onMouseDown.add(this.takeAim, this);
        onMouseUp.add(this.discharge, this);
        this._shootAudio = new AudioComponent("gunShoot");
        this._shootAudio.shouldLoop = false;
        this._takeAimAudio = new AudioComponent("aimStart");
        this._takeAimAudio.shouldLoop = false;
    }

    public takeAim(): void {
        this._aim.startAim();
        this._onTakeAim.invoke();
        this._takeAimAudio.stopPlaying();
        this._takeAimAudio.play();
    }

    public endAim(): void {
        this._aim.endAim();
        this._onStopAim.invoke();
    }

    public discharge(): void {
        this.endAim();
        let offset = { min: 5, max: 15 };
        this._shakerMaker.MakeShake(1, 5, 15);
        this._shootAudio.stopPlaying();
        this._shootAudio.play();
        this._onFire.invoke();
    }
}