class LevelSettings {
    private _sheets: OverlaySheet[] = [];
    private readonly _spawnX: number;
    private readonly _spawnY: number;
    private readonly _exitX: number;
    private readonly _exitY: number;
    private readonly _startMoveToLeft: boolean = false;
    private readonly _sheetCount: number;

    get spawnX() { return this._spawnX; }
    get spawnY() { return this._spawnY; }
    get exitX() { return this._exitX; }
    get exitY() { return this._exitY; }
    get sheets() { return this._sheets; }
    get startMoveToLeft() { return this._startMoveToLeft; }
    get sheetCount(): number { return this._sheetCount; }

    constructor(spawnX: number, spawnY: number, exitX: number, exitY: number, sheetCount: number) {
        this._spawnX = spawnX;
        this._spawnY = spawnY;
        this._exitX = exitX;
        this._exitY = exitY;
        this._sheetCount = sheetCount;
    }
    addSheet(sheet: OverlaySheet) {
        this._sheets.push(sheet);
    }
}