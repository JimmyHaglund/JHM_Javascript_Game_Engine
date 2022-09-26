class State {
    constructor() {
        this._onEnter = new Action();
        this._onExit = new Action();
        this._transitions = [];
    }
    get onEnter() { return this._onEnter; }
    get onExit() { return this._onExit; }
    addTransition(target) {
        this._transitions.push(target);
        return target;
    }
    removeTransition(target) {
        for (let n = 0; n < this._transitions.length; n++) {
            if (this._transitions[n] !== target)
                continue;
            this._transitions.splice(n, 1);
            return true;
        }
        return false;
    }
    goTo(target) {
        for (let n = 0; n < this._transitions.length; n++) {
            if (this._transitions[n] !== target)
                continue;
            this.onExit.invoke();
            target.onEnter.invoke();
            return true;
        }
        return false;
    }
}
