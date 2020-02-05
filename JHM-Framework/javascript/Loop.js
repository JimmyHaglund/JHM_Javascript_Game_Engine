class Loop {
    constructor(ticksPerSecond = 60, startPaused = false) {
        this._onUpdateEvents = [];
        this._interval = null;
        this._updateFunctions = {
            add: function (value) {
                this._onUpdateEvents.push(value);
            },
            remove: function (value) {
                let index = this._onUpdateEvents.indexOf(value);
                if (index < 0)
                    return;
                this._onUpdateEvents.shift(index, 0);
            }
        };
        if (!startPaused)
            this.play();
        this._intervalTime = 1000 / ticksPerSecond;
    }
    get playing() {
        return this._interval != null;
    }
    get ticksPerSecond() {
        return this._intervalTime > 0 ? Math.round(1000 / this._intervalTime) : 0;
    }
    get onUpdate() {
        return this._updateFunctions;
    }
    /* Note that when setting a new interval,
    the previous one won't carry over.
    so it's possible to continously stagger
    the update loop and never get a new tick.*/
    set ticksPerSecond(value) {
        if (this.ticksPerSecond != value) {
            this.pause();
        }
        if (value <= 0)
            this._intervalTime = 0;
        else
            this._intervalTime = 1000 / value;
        if (value > 0) {
            this.play();
        }
    }
    pause() {
        if (this._interval != null) {
            clearInterval(this._interval);
            this._interval = null;
        }
    }
    play() {
        if (this._intervalTime > 0 && this._interval == null) {
            this._interval = setInterval(this.update, this._intervalTime);
        }
    }
    update() {
        if (this._onUpdateEvents.length == 0)
            return;
        this._onUpdateEvents.forEach((event) => {
            event(this._intervalTime);
        });
    }
}
