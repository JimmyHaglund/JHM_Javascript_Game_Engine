class UiLoop {
    constructor(input) {
        this._active = true;
        this._onUpdate = new Action();
        input.onMouseMove.add(this.update, this);
        input.onMouseDown.add(this.lateUpdate, this);
        input.onMouseUp.add(this.lateUpdate, this);
    }
    get ticksPerSecond() { return -1; }
    get onUpdate() { return this._onUpdate; }
    get playing() { return this._active; }
    pause() { this._active = false; }
    play() { this._active = true; }
    update() {
        if (!this._active)
            return;
        this._onUpdate.invoke();
    }
    lateUpdate() {
        setTimeout(this.update.call(this), 20);
    }
}
