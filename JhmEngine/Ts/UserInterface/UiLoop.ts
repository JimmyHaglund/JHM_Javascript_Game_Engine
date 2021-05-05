class UiLoop implements ILoop {
    private _active: boolean = true;
    private _onUpdate: Action = new Action();
    get ticksPerSecond(): number { return -1; }
    get onUpdate() { return this._onUpdate; }
    get playing(): boolean { return this._active }
    constructor(input: MouseInput) { 
        input.onMouseMove.add(this.update, this);
        input.onMouseDown.add(this.lateUpdate, this);
        input.onMouseUp.add(this.lateUpdate, this);
    }

    pause(): void { this._active = false; }
    play(): void { this._active = true; }
    update(): void {
        if (!this._active) return;
        this._onUpdate.invoke();
    }
    private lateUpdate(){
        setTimeout(this.update.call(this), 20);
    }
}