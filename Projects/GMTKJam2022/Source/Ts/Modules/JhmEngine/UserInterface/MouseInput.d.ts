declare class MouseInput {
    private _onMouseMove;
    private _onMouseDown;
    private _onMouseUp;
    get onMouseMove(): Action;
    get onMouseDown(): Action;
    get onMouseUp(): Action;
    constructor();
    private moveMouse;
    private mouseDown;
    private mouseUp;
}
