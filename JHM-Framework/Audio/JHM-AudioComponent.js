/**
 * Component to be added to entities.
 */

function AudioComponent(audioID)
{
    // var audioID = audioID;
    var clip = document.getElementById(audioID);
    
    var audiocomponent = function()
    {
        this.Play = function()
        {
            clip.play();
        }
        this.StopPlaying = function()
        {
            clip.pause();
        }
        this.SetLoop = function(loopbool)
        {
            var value = Boolean(loopbool);
            clip.loop = value;
        }
    }
    audiocomponent.prototype = new Component();
    var returnComponent = new audiocomponent();
    returnComponent.SetType("AudioComponent");
    
    return new audiocomponent();

    
}