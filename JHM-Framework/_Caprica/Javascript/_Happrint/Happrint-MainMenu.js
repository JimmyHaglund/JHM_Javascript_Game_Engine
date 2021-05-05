class MainMenu {
    constructor() {
        this.onDestroy = new Action();
        this.onStartGame = new Action();
        this._input = new MouseInput();
        this._loop = new Loop(60);
        let width = screen.width * 0.6;
        let height = screen.height * 0.6;
        this._renderSpace = new RenderSpace(this._loop, width, height, 0, 0);
        this._uiSpace = new UiSpace(this._renderSpace, 0, this._input);
        this.startButton = this._uiSpace.createButton(width * 0.5 - 100, height * 0.1, 200, 150, "playButton_normal", "playButton_hover", "playButton_press");
        this._loop.update();
        this.startButton.onClick.add(this.startGame, this);
        global.menu = this;
        this.onStartGame.add(() => {
            global.game = new GameManager(0);
            global.game.onBackToMenu.add(() => {
                console.log("Back to main menu!");
                global.game.destroy();
                global.game = null;
                global.menu = new MainMenu();
            }, global.game);
        }, this);
        this.onDestroy.add(() => global.menu = null, this);
    }
    destroy() {
        this.onDestroy.invoke.call(this.onDestroy);
        this.startButton.destroy();
    }
    startGame() {
        this.onStartGame.invoke.call(this.onStartGame);
        this.destroy();
        this._renderSpace.destroy();
    }
}
