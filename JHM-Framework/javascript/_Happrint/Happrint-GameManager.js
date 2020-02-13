class GameManager {
    constructor(startLevelindex = 0) {
        this._mouseInput = new MouseInput();
        this.onBackToMenu = new Action();
        this.onDestroy = new Action();
        this._gameLoop = new Loop(60, false);
        this._renderSpace = new RenderSpace(this._gameLoop, 800, 500, 0, 0);
        this._simulationSpace = new PhysicsSpace(this._gameLoop);
        this._uiSpace = new UiSpace(this._renderSpace, -1000, this._mouseInput);
        this._levelManager = new LevelManager(this._renderSpace, this._simulationSpace, this._uiSpace, this._mouseInput, this._gameLoop);
        this._levelManager.loadLevel(startLevelindex);
        this._levelManager.onLastLevelExit.add(() => {
            this.onBackToMenu.invoke.call(this.onBackToMenu);
        }, this);
        this.createGameFrame();
    }
    createGameFrame() {
        let renderSp = this._renderSpace;
        let physicsSp = this._simulationSpace;
        let color = 'black';
        let fill = true;
        let left = 0;
        let top = 0;
        let width = 400;
        let height = 400;
        let thickness = 10;
        this._gameFrame = {
            top: new VisibleBoxCollider(left, top, width, thickness, renderSp, physicsSp, color, fill),
            right: new VisibleBoxCollider(left + width - thickness, top, thickness, height, renderSp, physicsSp, color, fill),
            left: new VisibleBoxCollider(left, top, thickness, height, renderSp, physicsSp, color, fill),
            bottom: new VisibleBoxCollider(left, top + height, width, thickness, renderSp, physicsSp, color, fill)
        };
    }
    destroy() {
        // this._previousLevelButton.destroy();
        // this._backToMenuButton.destroy();
        this._gameFrame.top.entity.destroy();
        this._gameFrame.right.entity.destroy();
        this._gameFrame.left.entity.destroy();
        this._gameFrame.bottom.entity.destroy();
    }
}
