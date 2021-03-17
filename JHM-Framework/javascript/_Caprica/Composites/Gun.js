class Gun {
    constructor(aim, shakerMaker) {
        this._onFire = new Action();
        this._onTakeAim = new Action();
        this._onStopAim = new Action();
        this._aim = aim;
        this._shakerMaker = shakerMaker;
        onMouseDown.add(this.takeAim, this);
        onMouseUp.add(this.discharge, this);
    }
    get onFire() { return this._onFire; }
    get onTakeAim() { return this._onTakeAim; }
    get onStopAim() { return this._onStopAim; }
    takeAim() {
        this._aim.startAim();
        this._onTakeAim.invoke();
    }
    endAim() {
        this._aim.endAim();
        this._onStopAim.invoke();
    }
    discharge() {
        this.endAim();
        let offset = { min: 5, max: 15 };
        this._shakerMaker.MakeShake(1, 5, 15);
        this._onFire.invoke();
    }
}
