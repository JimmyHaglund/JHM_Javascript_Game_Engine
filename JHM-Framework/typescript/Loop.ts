class Loop {
    private _intervalTime: number;
    private _interval: number = null;
    private _onUpdate: Action = new Action();

    get playing() {
        return this._interval != null;
    }
    get ticksPerSecond() {
        return this._intervalTime > 0 ? Math.round(1000 / this._intervalTime) : 0;
    }
    get onUpdate() {
        return this._onUpdate;
    }
    /* Note that when setting a new interval,
    the previous one won't carry over.
    so it's possible to continously stagger 
    the update loop and never get a new tick.*/
    set ticksPerSecond(value) {
        if (this.ticksPerSecond != value) {
            this.pause();
        }

        if (value <= 0) this._intervalTime = 0;
        else this._intervalTime = 1000 / value;

        if (value > 0) {
            this.play();
        }
    }

    constructor(ticksPerSecond: number = 60, startPaused: boolean = false) {
        this._intervalTime = 1000 / ticksPerSecond
        if (!startPaused) this.play();
    }


    pause() {
        if (this._interval != null) {
            clearInterval(this._interval);
            this._interval = null;
        }
    }
    play() {
        if (this._intervalTime > 0 && this._interval == null) {
            this._interval = setInterval(() => this.update.call(this), this._intervalTime);
        }
    }

    update(): void {
        this._onUpdate.invoke(this._intervalTime);
    }
}