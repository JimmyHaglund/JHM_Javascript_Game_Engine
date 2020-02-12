class MainMenu {
    constructor() {
        this.onDestroy = new Action();
        this.onStartGame = new Action();
        this._input = new MouseInput();
        this._loop = new Loop(60);
        this._renderSpace = new RenderSpace(this._loop, 1200, 1200, 0, 0);
        this._uiSpace = new UiSpace(this._renderSpace, 0, this._input);
        this.startButton = this._uiSpace.createButton(0, 0, 120, 200, "playButton_normal", "playButton_hover", "playButton_press");
        this._loop.update();
        this.startButton.onClick.add(this.startGame, this);
    }
    destroy() {
        this.onDestroy.invoke.call(this.onDestroy);
        this.startButton.destroy();
    }
    startGame() {
        this.destroy();
        this.onStartGame.invoke.call(this.onStartGame);
    }
}
