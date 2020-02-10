class LevelManager {
    constructor(renderSpace, physicsSpace, uiSpace, input) {
        this._sheetButtonPositions = [
            { x: 10, y: 20 },
            { x: 10, y: 40 },
            { x: 10, y: 60 },
            { x: 10, y: 80 },
            { x: 10, y: 100 }
        ];
        this._currentLevelIndex = -1;
        this._currentLevelSettings = null;
        this._levelButtons = [];
        this.levels = happrint_levels;
        this.sheetColors = happrint_sheetColors;
        this._renderSpace = renderSpace;
        this._physicsSpace = physicsSpace;
        this._mouseInput = input;
        this._uiSpace = uiSpace;
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
            // Set up sheet
            let sheetEntity = new Entity(0, 0);
            let imageName = "level_" + levelNumber + "_sheet_" + n;
            let sheet = new SheetBuilder(this._renderSpace, this._physicsSpace, this._mouseInput)
                .withColor('black')
                .withThickness(10)
                .buildFromImage(sheetEntity, imageName);
            levelSettings.addSheet(sheet);
            // Set up selection button
            let buttonNormalName = "button_" + n + "_normal";
            let buttonHoverName = "button_" + n + "_hover";
            let buttonPressName = "button_" + n + "_press";
            let button = this._uiSpace.createButton(20, 20, 100, 100, buttonNormalName, buttonHoverName, buttonPressName);
            button.onClick.add(() => {
                sheet.grab();
            }, sheet);
            this._levelButtons.push(button);
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
        this._levelButtons.forEach(button => {
            button.destroy();
        });
    }
}
