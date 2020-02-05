class Action {
    constructor() {
        this._actions = [];
    }
    add(delegateFunction) {
        this._actions.push(delegateFunction);
    }
    remove(delegateFunction) {
        let index = this._actions.findIndex((value) => value == delegateFunction);
        if (index == -1)
            return;
        this._actions.splice(index, 1);
    }
    invoke(...args) {
        for (let n = 0; n < this._actions.length; n++) {
            this._actions[n](args);
        }
    }
}
