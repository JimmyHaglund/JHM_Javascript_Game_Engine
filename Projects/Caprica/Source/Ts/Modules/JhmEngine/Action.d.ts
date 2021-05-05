declare class Action {
    private _actions;
    private _nextId;
    add(delegateFunction: (...args: any) => any, invoker: object): number;
    remove(actionId: number): void;
    invoke(...args: any): void;
}
