const Action = function() {
    let _actions = [];
    let _actionsArguments = [];

    class action {
        add(delegateFunction, functionArguments = null) {
            _actions.push(delegateFunction);
            _actionsArguments.push(functionArguments);
        }
        remove(delegateFunction) {
            let index = ArrayFindIndex(_actions, delegateFunction);
            if (index == -1) return;
            _actions.shift(index, 0);
            _actionsArguments.shift(index, 0);
        }
        invoke() {
            for (let n = 0; n < _actions.length; n++) {
                _actions[n](_actionsArguments[n]);
            }
        }
    }
    let handler = new action();
    return handler;
}