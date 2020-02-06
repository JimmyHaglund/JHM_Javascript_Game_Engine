class Input {
    constructor() {
        this._boundActions = Object.create(null);
        document.addEventListener("keydown", event => this.checkInput.call(this, event));
    }
    bindKeyAction(action, key, doubleCase = true) {
        if (key.length == 0)
            return;
        key = key[0];
        let keyCode = this.getUniCode(key);
        if (!(keyCode in this._boundActions)) {
            this._boundActions[keyCode.toString()] = [];
        }
        this._boundActions[keyCode.toString()].push(() => action.invoke.call(action));
        if (doubleCase)
            this.bindOtherCase(action, key);
    }
    bindOtherCase(action, key) {
        // TODO: Get opposite case key and call bindKeyAction for it.
        let otherCase = key.toUpperCase();
        if (otherCase == key)
            otherCase = key.toLowerCase();
        if (otherCase == key)
            return;
        this.bindKeyAction(action, otherCase, false);
    }
    checkInput(inputEvent) {
        let keyString = this.getUniCode(inputEvent.key).toString();
        let actions = this._boundActions[keyString];
        if (actions == undefined)
            return;
        actions.forEach(action => action());
    }
    getUniCode(char) {
        return char.charCodeAt(0);
    }
}
