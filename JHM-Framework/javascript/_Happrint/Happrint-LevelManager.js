class LevelManager {
    constructor(renderSpace, physicsSpace) {
        this._currentLevelIndex = -1;
        this._currentLevelSettings = null;
        this.levels = happrint_levels;
        this.sheetColors = happrint_sheetColors;
        this._renderSpace = renderSpace;
        this._physicsSpace = physicsSpace;
    }
    set currentLevelIndex(value) {
        if (value < -1)
            value = -1;
        if (value > this.levels.length)
            value = -1;
        this._currentLevelIndex = value;
    }
    get currentLevelIndex() { return this._currentLevelIndex; }
    nextLevel() {
        this.unloadCurrentLevel();
        this.loadLevel(++this._currentLevelIndex);
    }
    previousLevel() {
        this.unloadCurrentLevel();
        this.loadLevel(--this._currentLevelIndex);
    }
    loadLevel(levelNumber) {
        let levelSettings = this.levels[levelNumber];
        this.currentLevelIndex = levelNumber;
        if (levelSettings == undefined)
            return null;
        for (let n = 0; n < levelSettings.sheetCount; n++) {
            let sheetEntity = new Entity(0, 0);
            let imageName = "level_" + levelNumber + "_sheet_" + n;
            let sheet = OverlaySheet.generateFromImage(imageName, this._physicsSpace, this._renderSpace, sheetEntity, happrint_sheetColors[n - 1]);
            levelSettings.addSheet(sheet);
        }
        this._currentLevelSettings = levelSettings;
        return levelSettings;
    }
    unloadCurrentLevel() {
        console.log("Unload called.", this._currentLevelIndex);
        if (this._currentLevelIndex < 0)
            return;
        this._currentLevelSettings.sheets.forEach(sheet => {
            sheet.destroy();
        });
        this._currentLevelSettings = null;
        this._currentLevelIndex = -1;
    }
}
