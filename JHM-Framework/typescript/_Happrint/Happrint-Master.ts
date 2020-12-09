const global: {
    game: GameManager,
    menu: MainMenu
} = {
    game: null,
    menu: null
}
function happrint_start() {
    new MainMenu();
}