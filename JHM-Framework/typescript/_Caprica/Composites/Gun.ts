class Gun {
    public _onFire: Action;
    private _aim: AimController;
    private _shakerMaker: ShakerMaker;

    constructor(aim: AimController, shakerMaker: ShakerMaker) {
        this._aim = aim;
        this._shakerMaker = shakerMaker;
        onMouseDown.add(this.takeAim, this);
        onMouseUp.add(this.discharge, this);
    }

    public takeAim(): void {
        this._aim.startAim();
    }

    public endAim(): void {
        this._aim.endAim();
    }   

    public discharge(): void {
        this.endAim();
        let offset = { min: 5, max:15 };
        this._shakerMaker.MakeShake(1, 5, 15);
    }
}