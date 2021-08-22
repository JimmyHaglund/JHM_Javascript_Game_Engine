declare class Binding {
    mainBindingCode: string;
    alternateBindingCode: string;
    onPressed: Action;
    onReleased: Action;
    private _isDown;
    constructor(main?: string, alternate?: string);
    checkPressed(event: KeyboardEvent): void;
    checkReleased(event: KeyboardEvent): void;
    private notifyPressed;
    private notifyReleased;
}
