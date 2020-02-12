class LevelManager {
    private readonly _sheetButtonPositions = [
        { x: 10, y: 20 },
        { x: 10, y: 40 },
        { x: 10, y: 60 },
        { x: 10, y: 80 },
        { x: 10, y: 100 }
    ];
    private readonly _renderSpace: RenderSpace;
    private readonly _physicsSpace: PhysicsSpace;
    private readonly _uiSpace: UiSpace;

    private _currentLevelIndex: number = -1;
    private _currentLevelSettings: LevelSettings = null;
    private _levelButtons: BoxButton[] = [];
    private _walkers: WalkingCharacter[] = [];
    private _mouseInput: MouseInput;
    private _stopButton: BoxButton;
    private _playButton: BoxButton;
    private _loop: ILoop;
    private _exit: LevelExit;
    private _nextLevelButton: BoxButton = null;

    readonly onLevelComplete: Action = new Action();
    readonly levels: LevelSettings[] = happrint_levels;
    readonly sheetColors: string[] = happrint_sheetColors;

    private set currentLevelIndex(value: number) {
        if (value < -1) value = -1;
        if (value > this.levels.length) value = -1;
        this._currentLevelIndex = value;
    }
    private get currentLevelIndex(): number { return this._currentLevelIndex; }

    constructor(renderSpace: RenderSpace, physicsSpace: PhysicsSpace,
        uiSpace: UiSpace, input: MouseInput, loop: ILoop) {
        this._renderSpace = renderSpace;
        this._physicsSpace = physicsSpace;
        this._mouseInput = input;
        this._uiSpace = uiSpace;
        this._loop = loop;
    }
    nextLevel() {
        this.unloadCurrentLevel();
        this.loadLevel(++this._currentLevelIndex);
    }
    previousLevel() {
        this.unloadCurrentLevel();
        this.loadLevel(--this._currentLevelIndex);
    }
    loadLevel(levelNumber: number): LevelSettings {
        let levelSettings = this.levels[levelNumber];
        this.currentLevelIndex = levelNumber;
        if (levelSettings == undefined) return null;
        for (let n = 0; n < levelSettings.sheetCount; n++) {
            let sheet = this.generateSheet(levelNumber, n);
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
            if (this._nextLevelButton != null) return;
            this._nextLevelButton = this._uiSpace.createButton(0, 0, 50, 30,
                "nextButton_normal", "nextButton_hover", "nextButton_press");
            this._nextLevelButton.onClick.add(() => {
                this.nextLevel();
                this._nextLevelButton.destroy();
                this._nextLevelButton = null;
            }, this);
        }, this);
        return levelSettings;
    }
    unloadCurrentLevel(): void {
        // console.log("Unload called.", this._currentLevelIndex);
        if (this._currentLevelIndex < 0) return;
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
    private generateWalkers(count: number, playButton: BoxButton, stopButton: BoxButton): void {
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
    private clearWalkers() {
        this._walkers.forEach(walker => walker.destroy());
        this._walkers = [];
    }
    private generateSheet(levelIndex: number, sheetIndex: number): OverlaySheet {
        let sheetEntity = new Entity(0, 0);
        let imageName = "level_" + levelIndex + "_sheet_" + sheetIndex;
        let sheet = new SheetBuilder(
            this._renderSpace, this._physicsSpace, this._mouseInput)
            .withColor('black')
            .withThickness(10)
            .buildFromImage(sheetEntity, imageName);
        this._mouseInput.onMouseUp.add(() => sheet.release(), sheet);
        return sheet;
    }
    private generateGrabButton(sheet: OverlaySheet, sheetIndex: number): BoxButton {
        let buttonNormalName = "button_" + sheetIndex + "_normal";
        let buttonHoverName = "button_" + sheetIndex + "_hover";
        let buttonPressName = "button_" + sheetIndex + "_press";
        let button = this._uiSpace.createButton(20, 20, 100, 100,
            buttonNormalName, buttonHoverName, buttonPressName);
        button.onClick.add(() => {
            sheet.grab();
        }, sheet);
        return button;
    }
    private generateExit(): LevelExit {
        let exit = new LevelExit(this._loop, this._walkers.slice(0), this._renderSpace);
        exit.onWalkersEmpty.add(this.onLevelComplete.invoke, this.onLevelComplete);
        return exit;
    }
    private generatePlayButton(): BoxButton {
        return this._uiSpace.createButton(150, 0, 90, 90,
            "playButton_normal", "playButton_hover", "playButton_press");
    }
    private generateStopButton(): BoxButton {
        return this._uiSpace.createButton(250, 0, 90, 90,
            "stopButton_normal", "stopButton_hover", "stopButton_press");
    }
}