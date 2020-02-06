interface ILoop {
    playing: boolean;
    ticksPerSecond: number;
    onUpdate: Action;
    pause(): void;
    play(): void;
    update(): void
}