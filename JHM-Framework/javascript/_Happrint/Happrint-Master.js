function happrint_start() {
    let menu = new MainMenu();
    let game = null;
    menu.onStartGame.add(() => game = new GameManager(0), this);
    menu.onDestroy.add(() => menu = null, this);
}
