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
        this._walkers = [];
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
            let sheet = this.generateSheet(levelNumber, n);
            levelSettings.addSheet(sheet);
            this._levelButtons.push(this.generateGrabButton(sheet, n));
        }
        this._stopButton = this.generateStopButton();
        this._playButton = this.generatePlayButton();
        this.generateWalkers(levelSettings.walkerCount, this._playButton, this._stopButton);
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
        this._levelButtons.forEach(button => button.destroy());
        this.clearWalkers();
        this._stopButton.destroy();
        this._playButton.destroy();
    }
    generateWalkers(count, playButton, stopButton) {
        for (let n = 0; n < count; n++) {
            let entity = new Entity(100, 50);
            this._walkers.push(new WalkingCharacter(entity, 1500, this._renderSpace, this._physicsSpace));
            playButton.onClick.add(() => {
                this._walkers.forEach(walker => {
                    walker.shouldMove = true;
                });
            }, this);
            stopButton.onClick.add(() => {
                this._walkers.forEach(walker => {
                    walker.entity.transform.x = 50;
                    walker.entity.transform.y = 50;
                    walker.shouldMove = false;
                });
            }, this);
        }
    }
    clearWalkers() {
        this._walkers.forEach(walker => walker.destroy());
        this._walkers = [];
    }
    generateSheet(levelIndex, sheetIndex) {
        let sheetEntity = new Entity(0, 0);
        let imageName = "level_" + levelIndex + "_sheet_" + sheetIndex;
        let sheet = new SheetBuilder(this._renderSpace, this._physicsSpace, this._mouseInput)
            .withColor('black')
            .withThickness(10)
            .buildFromImage(sheetEntity, imageName);
        this._mouseInput.onMouseUp.add(() => sheet.release(), sheet);
        return sheet;
    }
    generateGrabButton(sheet, sheetIndex) {
        let buttonNormalName = "button_" + sheetIndex + "_normal";
        let buttonHoverName = "button_" + sheetIndex + "_hover";
        let buttonPressName = "button_" + sheetIndex + "_press";
        let button = this._uiSpace.createButton(20, 20, 100, 100, buttonNormalName, buttonHoverName, buttonPressName);
        button.onClick.add(() => {
            sheet.grab();
        }, sheet);
        return button;
    }
    generatePlayButton() {
        return this._uiSpace.createButton(150, 0, 90, 90, "playButton_normal", "playButton_hover", "playButton_press");
    }
    generateStopButton() {
        return this._uiSpace.createButton(250, 0, 90, 90, "stopButton_normal", "stopButton_hover", "stopButton_press");
    }
}
