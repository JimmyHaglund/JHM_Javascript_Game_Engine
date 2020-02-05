class Action {
    constructor() {
        this._actions = [];
        this._nextId = 0;
    }
    add(delegateFunction, invoker) {
        console.log(this);
        this._actions.push({
            id: this._nextId,
            action: delegateFunction,
            invoker: invoker
        });
        console.log("Invoker:", invoker);
        return this._nextId++;
    }
    remove(actionId) {
        let index = this._actions.findIndex((value) => value.id == actionId);
        if (index == -1)
            return;
        this._actions.splice(index, 1);
    }
    invoke(...args) {
        for (let n = 0; n < this._actions.length; n++) {
            console.log(this._actions[n].invoker);
            let a = this._actions[n].action;
            this._actions[n].action.call(this._actions[n].invoker, args);
        }
    }
}
