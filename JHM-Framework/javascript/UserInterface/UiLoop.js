class UiLoop {
    constructor() {
        this._active = true;
        this._onUpdate = new Action();
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
}
