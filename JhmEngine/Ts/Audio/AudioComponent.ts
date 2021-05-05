class AudioComponent {
    private _clip: HTMLAudioElement;

    set shouldLoop(value) { this._clip.loop = value; }

    constructor(audioId: string) {
        this._clip = document.getElementById(audioId) as HTMLAudioElement;
    }
    play() {
        this._clip.play();
    }
    stopPlaying(reset:boolean = true) {
        this._clip.pause();
        if (reset) this._clip.currentTime = 0;
    }
}