/**
 * @constructor Loop
 * @param ticksPerSecond Number of updates per second
 */
function Loop(ticksPerSecond = 60, startPaused = false) {
    class loop {
        constructor() { 
            if (!startPaused) this.play();
        }
        // Note that when setting a new interval,
        // the previous one won't carry over.
        // so it's possible to continously stagger 
        // the update loop and never get a new tick.
        set ticksPerSecond(value) {
            if (ticksPerSecond != value) {
                this.pause();
            }
            
            if (value <= 0) _intervalTime = 0;
            else _intervalTime = 1000 / value;
            
            if (value > 0) {
                this.play();
            }
        }
        get ticksPerSecond() {
            return _intervalTime > 0 ? Math.round(1000 / _intervalTime) : 0;
        }
        get update() {
            return _updateFunctions;
        }
        pause() {
            if (_interval != null) {
                clearInterval(_interval);
                _interval = null;
            }
        }
        play() {
            if (_intervalTime > 0 && _interval == null) {
                _interval = setInterval(update, _intervalTime);
            }
        }
        get playing(){
            return _interval != null;
        }
    }
    // Private members & methods
    let _intervalTime = 1000 / ticksPerSecond;
    let _onUpdateEvents = [];
    let _interval = null;
    let _updateFunctions = {
        add: function (value) {
            if (typeof value != typeof (() => { })) return;
            _onUpdateEvents.push(value);
        },
        remove: function (value) {
            let index = _onUpdateEvents.indexOf(value);
            if (index < 0) return;

            _onUpdateEvents.shift(index, 0);
        }
    };
    let _myLoop = new loop();
    
    function update() {
        if (_onUpdateEvents.length == 0) return;
        _onUpdateEvents.forEach((event) => {
            event();
        });
    }

    return _myLoop;
}

class Interval {

    constructor(interavalTime) {
        this.interavalTime = interavalTime;
        this.onUpdate = [];
        setInterval
    }
    Update() {
        onUpdate.forEach(element => {

        });
    }
}