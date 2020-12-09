class AudioComponent
{
    private _clip: HTMLAudioElement; 
    
    set shouldLoop(value){ this._clip.loop = value; }
    
    constructor(audioId: string){
        this._clip = document.getElementById(audioId) as HTMLAudioElement; 
    }
    Play()
    {
        this._clip.play();
    }
    StopPlaying()
    {
        this._clip.pause();
    }
}