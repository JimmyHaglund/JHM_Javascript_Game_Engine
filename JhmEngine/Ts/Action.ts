class Action {
    private _actions: {
            id: number,
            action: ((...args: any) => any),
            invoker: object
        }[] = [];
    private _nextId: number = 0;
    add(delegateFunction: (...args: any) => any, invoker: object): number {
        this._actions.push({
            id: this._nextId,
            action: delegateFunction, 
            invoker: invoker
        });
        return this._nextId++;
    }
    remove(actionId: number) {
        let index = this._actions.findIndex((value) =>
            value.id == actionId);
        if (index == -1) return;
        this._actions.splice(index, 1);
    }
    invoke(...args: any) {
        for (let n = 0; n < this._actions.length; n++) {
            let a = this._actions[n].action;
            this._actions[n].action.call(
                this._actions[n].invoker, 
                args[0], args[1], args[2], args[3], args[4], args[5], 
                args[6], args[7], args[8], args[9]);
        }
    }
}