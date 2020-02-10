class GameManager {
    private _levelManager: LevelManager;
    private _renderSpace: RenderSpace;
    private _gameLoop: Loop;
    private _simulationSpace: PhysicsSpace;
    private _uiSpace: UiSpace;
    private _mouseInput = new MouseInput();

    private _nextLevelButton: BoxButton;
    private _previousLevelButton: BoxButton;
    private _backToMenuButton: BoxButton;

    constructor(startLevelindex: number = 0) {
        this._gameLoop = new Loop(60, false);
        this._renderSpace = new RenderSpace(this._gameLoop, 1200, 900, 0, 0);
        this._simulationSpace = new PhysicsSpace(this._gameLoop);
        this._uiSpace = new UiSpace(this._renderSpace, -1000, this._mouseInput);
        this._levelManager = new LevelManager(this._renderSpace,
            this._simulationSpace, this._uiSpace, this._mouseInput);
        this._levelManager.loadLevel(startLevelindex);
        
        this._nextLevelButton = this._uiSpace.createButton(0, 0, 50, 30, 
            "nextButton_normal", "nextButton_hover", "nextButton_press");
    }
}