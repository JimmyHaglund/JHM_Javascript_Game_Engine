declare class AudioComponent {
    private _clip;
    set shouldLoop(value: any);
    constructor(audioId: string);
    play(): void;
    stopPlaying(reset?: boolean): void;
}
