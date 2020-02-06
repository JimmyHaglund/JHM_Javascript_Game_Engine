class Input {
    private _boundActions: object = Object.create(null);

    constructor() {
        document.addEventListener("keydown", event =>
            this.checkInput.call(this, event));
    }

    bindKeyAction(action: Action, key: string, doubleCase: boolean = true) {
        if (key.length == 0) return;
        key = key[0];
        let keyCode = this.getUniCode(key);
        if (!(keyCode in this._boundActions)) {
            this._boundActions[keyCode.toString()] = [];
        }
        this._boundActions[keyCode.toString()].push(() => action.invoke.call(action));
        if (doubleCase) this.bindOtherCase(action, key);
    }
    private bindOtherCase(action: Action, key: string) {
        // TODO: Get opposite case key and call bindKeyAction for it.
        let otherCase = key.toUpperCase();
        if (otherCase == key) otherCase = key.toLowerCase();
        if (otherCase == key) return;
        this.bindKeyAction(action, otherCase, false);
    }
    checkInput(inputEvent: KeyboardEvent) {
        let keyString = this.getUniCode(inputEvent.key).toString();
        let actions = this._boundActions[keyString];
        if (actions == undefined) return;
        actions.forEach(action => action());
    }
    private getUniCode(char: string): number {
        return char.charCodeAt(0);
    }
}