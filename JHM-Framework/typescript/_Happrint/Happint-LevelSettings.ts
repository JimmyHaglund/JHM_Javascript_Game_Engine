class LevelSettings {
    private _sheets: OverlaySheet[] = [];
    private _spawnX: number;
    private _spawnY: number;
    private _exitX: number;
    private _exitY: number;
    private _startMoveToLeft: boolean = false;

    get spawnX() { return this._spawnX; }
    get spawnY() { return this.spawnY; }
    get exitX() { return this._exitX; }
    get exitY() { return this._exitY; }
    get sheets() { return this._sheets; }
    get startMoveToLeft() { return this._startMoveToLeft; }

    constructor(spawnX: number, spawnY: number, exitX: number, exitY: number) {
        this._spawnX = spawnX;
        this._spawnY = spawnY;
        this._exitX = exitX;
        this._exitY = exitY;
    }
    addSheet(sheet: OverlaySheet) {
        this._sheets.push(sheet);
    }
}