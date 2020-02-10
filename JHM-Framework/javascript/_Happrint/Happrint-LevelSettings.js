class LevelSettings {
    constructor(spawnX, spawnY, exitX, exitY, sheetCount, walkerCount = 1) {
        this._sheets = [];
        this._startMoveToLeft = false;
        this._spawnX = spawnX;
        this._spawnY = spawnY;
        this._exitX = exitX;
        this._exitY = exitY;
        this._sheetCount = sheetCount;
        this.walkerCount = walkerCount;
    }
    get spawnX() { return this._spawnX; }
    get spawnY() { return this._spawnY; }
    get exitX() { return this._exitX; }
    get exitY() { return this._exitY; }
    get sheets() { return this._sheets; }
    get startMoveToLeft() { return this._startMoveToLeft; }
    get sheetCount() { return this._sheetCount; }
    addSheet(sheet) {
        this._sheets.push(sheet);
    }
}
