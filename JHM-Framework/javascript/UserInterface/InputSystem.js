class InputSystem {
    bindKeyAction(action, key) {
        if (key.length == 0)
            return;
        key = key[0];
        let keyLower = this.getUniCode(key.toLowerCase());
        let keyCap = this.getUniCode(key.toUpperCase());
        document.addEventListener("keydown", (event) => {
            if (event.keyCode == keyLower || event.keyCode == keyCap) {
                action.invoke.call(action);
            }
        });
    }
    getUniCode(char) {
        return char.charCodeAt(0);
    }
    constructor() { }
}
