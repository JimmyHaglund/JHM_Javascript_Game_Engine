declare class KeyboardInput {
    private _boundActions;
    constructor();
    bindKeyAction(action: Action, key: string, doubleCase?: boolean): void;
    private bindOtherCase;
    checkKeyboardInput(inputEvent: KeyboardEvent): void;
    private getUniCode;
}
