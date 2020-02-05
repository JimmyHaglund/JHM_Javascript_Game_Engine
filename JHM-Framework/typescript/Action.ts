class Action {
    private _actions: ((...args: any[]) => any)[] = [];

    add(delegateFunction: (...args: any[]) => any) {
        this._actions.push(delegateFunction);
    }
    remove(delegateFunction: (...args: any[]) => any) {
        let index: number = this._actions.findIndex((value) => value == delegateFunction);
        if (index == -1) return;
        this._actions.splice(index, 1);
    }
    invoke(...args: any[]) {
        for (let n = 0; n < this._actions.length; n++) {
            this._actions[n](args);
        }
    }
}