declare class Loop implements ILoop {
    private _intervalTime;
    private _interval;
    private _onUpdate;
    get playing(): boolean;
    get ticksPerSecond(): number;
    get onUpdate(): Action;
    set ticksPerSecond(value: number);
    constructor(ticksPerSecond?: number, startPaused?: boolean);
    pause(): void;
    play(): void;
    update(): void;
}
