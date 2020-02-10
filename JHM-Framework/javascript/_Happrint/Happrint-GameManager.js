class GameManager {
    constructor(startLevelindex = 0) {
        this._mouseInput = new MouseInput();
        this._gameLoop = new Loop(60, false);
        this._renderSpace = new RenderSpace(this._gameLoop, 1200, 900, 0, 0);
        this._simulationSpace = new PhysicsSpace(this._gameLoop);
        this._uiSpace = new UiSpace(this._renderSpace, -1000, this._mouseInput);
        this._levelManager = new LevelManager(this._renderSpace, this._simulationSpace, this._uiSpace, this._mouseInput, this._gameLoop);
        this._levelManager.loadLevel(startLevelindex);
    }
}
