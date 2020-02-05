const iLoop = Symbol("iLoop");
// Number ticksPerSecond {set, get}
// void pause()
// void play()
// bool playing {get}
// object update {get} => {void add(value), void remove(value)}
/**
 * @constructor Loop
 * @param ticksPerSecond Number of updates per second
 */
const Loop = function(ticksPerSecond = 60, startPaused = false) {
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
        get playing() {
            return _interval != null;
        }
    }
    
    let _myLoop = new loop();

    function update() {
        if (_onUpdateEvents.length == 0) return;
        _onUpdateEvents.forEach((event) => {
            event(_intervalTime);
        });
    }

    return _myLoop;
}