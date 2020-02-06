class LevelSettings {
    constructor(spawnX, spawnY, exitX, exitY) {
        this._sheets = [];
        this._startMoveToLeft = false;
        this._spawnX = spawnX;
        this._spawnY = spawnY;
        this._exitX = exitX;
        this._exitY = exitY;
    }
    get spawnX() { return this._spawnX; }
    get spawnY() { return this.spawnY; }
    get exitX() { return this._exitX; }
    get exitY() { return this._exitY; }
    get sheets() { return this._sheets; }
    get startMoveToLeft() { return this._startMoveToLeft; }
    addSheet(sheet) {
        this._sheets.push(sheet);
    }
}
