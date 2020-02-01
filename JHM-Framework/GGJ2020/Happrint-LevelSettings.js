const LevelSettings = function (startX, startY, exitX, exitY) {
    let _sheets = [];
    let _startX = startX;
    let _startY = startY;
    let _exitX = exitX;
    let _exitY = exitY;
    class Exit {
        get x() { return _exitX; }
        get y() { return _exitY; }
    }
    class Start {
        get x() { return _startX; }
        get y() { return _startY; }
    }
    let _start = new Start();
    let _exit = new Exit();
    class levelSettings {
        constructor() { }
        addSheet(sheet) {
            _sheets.push(sheet);
        }
        get sheets() { return _sheets; }
        get start() { return _start; }
        get exit() { return _exit; }
    }
    return new levelSettings();
}