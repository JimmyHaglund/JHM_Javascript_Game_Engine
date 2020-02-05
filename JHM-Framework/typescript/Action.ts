class Action {
    private _actions: ((args: any) => any)[] = [];
    private _actionsArguments: any[] = [];

    add(delegateFunction: ((args: any) => any), functionArguments: any[] = null) {
        this._actions.push(delegateFunction);
        this._actionsArguments.push(functionArguments);
    }
    remove(delegateFunction) {
        let index: number = this._actions.findIndex((value) => value == delegateFunction);
        if (index == -1) return;
        this._actions.splice(index, 1);
        this._actionsArguments.splice(index, 1);
    }
    invoke() {
        for (let n = 0; n < this._actions.length; n++) {
            this._actions[n](this._actionsArguments[n]);
        }
    }
}