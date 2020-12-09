class LevelManager {
    constructor(renderSpace, physicsSpace, uiSpace, input, loop) {
        this._sheetButtonPositions = [
            { x: 410, y: 20 },
            { x: 410, y: 90 },
            { x: 410, y: 160 },
            { x: 410, y: 230 },
            { x: 410, y: 300 }
        ];
        this._sheetPositions = [
            { x: 470, y: 10 },
            { x: 640, y: 20 },
            { x: 470, y: 190 },
            { x: 640, y: 200 },
            { x: 470, y: 270 }
        ];
        this._currentLevelNumber = 0;
        this._currentLevelSettings = null;
        this._levelButtons = [];
        this._walkers = [];
        this._nextLevelButton = null;
        this.onLevelComplete = new Action();
        this.levels = happrint_levels;
        this.sheetColors = happrint_sheetColors;
        this.onLastLevelExit = new Action();
        this._renderSpace = renderSpace;
        this._physicsSpace = physicsSpace;
        this._mouseInput = input;
        this._uiSpace = uiSpace;
        this._loop = loop;
    }
    set currentLevelIndex(value) {
        if (value < 0)
            value = -1;
        if (value >= this.levels.length)
            value = -1;
        this._currentLevelNumber = value + 1;
    }
    get currentLevelIndex() { return this._currentLevelNumber - 1; }
    nextLevel() {
        this.loadLevel(this.currentLevelIndex + 1);
        if (this.currentLevelIndex == -1) {
            this.onLastLevelExit.invoke.call(this.onLastLevelExit);
        }
    }
    previousLevel() {
        this.loadLevel(this.currentLevelIndex - 1);
    }
    loadLevel(levelIndex) {
        this.unloadCurrentLevel();
        let levelSettings = this.levels[levelIndex];
        this.currentLevelIndex = levelIndex;
        if (this.currentLevelIndex < 0)
            return null;
        if (levelSettings == undefined)
            return null;
        for (let n = 0; n < levelSettings.sheetCount; n++) {
            let sheet = this.generateSheet(this._currentLevelNumber, n + 1);
            levelSettings.addSheet(sheet);
            this._levelButtons.push(this.generateGrabButton(sheet, n));
        }
        this._stopButton = this.generateStopButton();
        this._playButton = this.generatePlayButton();
        this.generateWalkers(levelSettings.walkerCount, this._playButton, this._stopButton);
        this._currentLevelSettings = levelSettings;
        this._exit = this.generateExit();
        this._stopButton.onClick.add(() => {
            this._exit.destroy();
            this._exit = this.generateExit();
        }, this);
        this.onLevelComplete.add(() => {
            if (this._nextLevelButton != null)
                return;
            this._nextLevelButton = this._uiSpace.createButton(340, 410, 60, 40, "nextButton_normal", "nextButton_hover", "nextButton_press");
            this._nextLevelButton.onClick.add(() => {
                this.nextLevel();
                this._nextLevelButton.destroy();
                this._nextLevelButton = null;
            }, this);
        }, this);
        return levelSettings;
    }
    unloadCurrentLevel() {
        if (this.currentLevelIndex < 0)
            return;
        this._currentLevelSettings.sheets.forEach(sheet => {
            sheet.destroy();
        });
        this._currentLevelSettings = null;
        this.currentLevelIndex = -1;
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
    generateSheet(levelNumber, sheetNumber) {
        let sheetIndex = sheetNumber - 1;
        let imageName = "level_" + levelNumber + "_sheet_" + sheetNumber;
        let sheetX = this._sheetPositions[sheetIndex].x; // * window.innerWidth;
        let sheetY = this._sheetPositions[sheetIndex].y; // * window.innerHeight;
        let sheetEntity = new Entity(sheetX, sheetY);
        let sheet = new SheetBuilder(this._renderSpace, this._physicsSpace, this._mouseInput)
            .withColor('black')
            .withThickness(5)
            .buildFromImage(sheetEntity, imageName);
        this._mouseInput.onMouseUp.add(() => sheet.release(), sheet);
        return sheet;
    }
    generateGrabButton(sheet, sheetIndex) {
        let buttonNormalName = "button_" + (sheetIndex + 1) + "_normal";
        let buttonHoverName = "button_" + (sheetIndex + 1) + "_hover";
        let buttonPressName = "button_" + (sheetIndex + 1) + "_press";
        let button = this._uiSpace.createButton(this._sheetButtonPositions[sheetIndex].x, this._sheetButtonPositions[sheetIndex].y, 60, 60, buttonNormalName, buttonHoverName, buttonPressName);
        button.onClick.add(() => {
            sheet.grab();
        }, sheet);
        return button;
    }
    generateExit() {
        let exit = new LevelExit(this._loop, this._walkers.slice(0), this._renderSpace);
        exit.onWalkersEmpty.add(this.onLevelComplete.invoke, this.onLevelComplete);
        return exit;
    }
    generatePlayButton() {
        return this._uiSpace.createButton(30, 410, 60, 60, "playButton_normal", "playButton_hover", "playButton_press");
    }
    generateStopButton() {
        return this._uiSpace.createButton(100, 410, 60, 60, "stopButton_normal", "stopButton_hover", "stopButton_press");
    }
}
