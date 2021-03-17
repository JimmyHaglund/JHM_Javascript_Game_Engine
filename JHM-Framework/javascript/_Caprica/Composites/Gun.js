class Gun {
    constructor(aim, shakerMaker) {
        this._aim = aim;
        this._shakerMaker = shakerMaker;
        onMouseDown.add(this.takeAim, this);
        onMouseUp.add(this.discharge, this);
    }
    takeAim() {
        this._aim.startAim();
    }
    endAim() {
        this._aim.endAim();
    }
    discharge() {
        this.endAim();
        let offset = { min: 5, max: 15 };
        this._shakerMaker.MakeShake(1, 5, 15);
    }
}
