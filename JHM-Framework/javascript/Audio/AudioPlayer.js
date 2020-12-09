class AudioComponent {
    constructor(audioId) {
        this._clip = document.getElementById(audioId);
    }
    set shouldLoop(value) { this._clip.loop = value; }
    Play() {
        this._clip.play();
    }
    StopPlaying() {
        this._clip.pause();
    }
}
