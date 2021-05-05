class AudioComponent {
    constructor(audioId) {
        this._clip = document.getElementById(audioId);
    }
    set shouldLoop(value) { this._clip.loop = value; }
    play() {
        this._clip.play();
    }
    stopPlaying() {
        this._clip.pause();
    }
}
