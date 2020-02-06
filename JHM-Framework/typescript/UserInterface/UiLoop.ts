class UiLoop implements ILoop {
    private _active: boolean = true;
    private _onUpdate: Action = new Action();
    get ticksPerSecond(): number { return -1; }
    get onUpdate() { return this._onUpdate; }
    get playing(): boolean { return this._active }
    constructor() { }

    pause(): void { this._active = false; }
    play(): void { this._active = true; }
    update(): void {
        if (!this._active) return;
        this._onUpdate.invoke();
    }
}