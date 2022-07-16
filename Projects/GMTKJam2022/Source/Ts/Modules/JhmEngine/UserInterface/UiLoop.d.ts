declare class UiLoop implements ILoop {
    private _active;
    private _onUpdate;
    get ticksPerSecond(): number;
    get onUpdate(): Action;
    get playing(): boolean;
    constructor(input: MouseInput);
    pause(): void;
    play(): void;
    update(): void;
    private lateUpdate;
}
