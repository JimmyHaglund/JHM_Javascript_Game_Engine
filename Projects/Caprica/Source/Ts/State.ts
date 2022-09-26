class State {
    private _onEnter: Action = new Action();
    private _onExit: Action = new Action();
    private _transitions: State[] = [];
    public get onEnter() { return this._onEnter; }
    public get onExit() { return this._onExit; }

    public addTransition(target: State): State {
        this._transitions.push(target);
        return target;
    }

    public removeTransition(target: State): boolean {
        for(let n = 0; n < this._transitions.length; n++) {
            if (this._transitions[n] !== target) continue;
            this._transitions.splice(n, 1);
            return true;
        }
        return false;
    }

    public goTo(target: State): boolean {
        for(let n = 0; n < this._transitions.length; n++) {
            if (this._transitions[n] !== target) continue;
            this.onExit.invoke();
            target.onEnter.invoke();
            return true;
        }
        return false;
    }
}