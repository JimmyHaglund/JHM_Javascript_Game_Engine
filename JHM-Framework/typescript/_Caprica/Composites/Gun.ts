class Gun {
    private _onFire = new Action();
    private _onTakeAim = new Action();
    private _onStopAim = new Action();
    private _aim: AimController;
    private _shakerMaker: ShakerMaker;

    public get onFire(): Action { return this._onFire; }
    public get onTakeAim(): Action { return this._onTakeAim; }
    public get onStopAim(): Action { return this._onStopAim; }

    constructor(aim: AimController, shakerMaker: ShakerMaker) {
        this._aim = aim;
        this._shakerMaker = shakerMaker;
        onMouseDown.add(this.takeAim, this);
        onMouseUp.add(this.discharge, this);
    }

    public takeAim(): void {
        this._aim.startAim();
        this._onTakeAim.invoke();
    }

    public endAim(): void {
        this._aim.endAim();
        this._onStopAim.invoke();
    }

    public discharge(): void {
        this.endAim();
        let offset = { min: 5, max: 15 };
        this._shakerMaker.MakeShake(1, 5, 15);
        this._onFire.invoke();
    }
}