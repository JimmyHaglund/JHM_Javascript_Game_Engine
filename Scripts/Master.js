/**
 * @file
 * Creates and manipulates game according to customization.
 */
// System variables.
var debugModeEnabled = false;

// Game windows.
var gameWindow;
var gameWindowWidth = screen.width * 0.5;
var gameWindowHeight = screen.height * 0.7;

// Uglu solution for input
var heldDownKeys = 
{
    w : false,
    a : false,
    s : false,
    d : false,
    space : false
};
var testSprite = null;
function Start()
{
    // Create game window.
    gameWindow = WindowManager.AddWindow(
        gameWindowWidth*0.05,
        gameWindowHeight*0.05,
        gameWindowWidth, 
        gameWindowHeight);
    gameWindow.SetBackgroundColor("#33ccff");

    var imgEntity = gameWindow.AddEntity(50, 50);
    testSprite = imgEntity.AddComponent(new SpriteComponent("buttonnormal"));
}

// Run when mouse is pressed down.
function AcceptMousePress(event)
{
    testSprite.SetSpriteByURL("SpriteA.png");


    var clickEvent = WindowManager.CheckPoint(event.clientX, event.clientY);
    // console.log(clickEvent.gameWindow);
    InterfaceManager.CheckButtonPress(clickEvent);
}
// Run when mouse button is released.
function AcceptMouseRelease(event)
{
    var clickEvent = WindowManager.CheckPoint(event.clientX, event.clientY);
    InterfaceManager.ReleaseButtonPress();

}
// Run whenever mouse is moved.
function MouseMove(event)
{
     var clickEvent = WindowManager.CheckPoint(event.clientX, event.clientY);
     InterfaceManager.CheckHover(clickEvent);
}

// Periodic update. Render & update logic.
function RunLoop()
{
    WindowManager.UpdateLogic();
    WindowManager.Render();
}

function AcceptKeyPress(event)
{
    // console.log("Registered key down event: " + event.key);
    SetKeyState(event.key, true);
}
function AcceptKeyUp(event)
{
    SetKeyState(event.key, false);
}

function SetKeyState(key, state)
{
    switch (key)
    {
        case "W":
        case "w":
            heldDownKeys.w = state;
            break;
        case "A":
        case "a":
            heldDownKeys.a = state;
            break;
        case "S":
        case "s":
            heldDownKeys.s = state;
            break;
        case "D":
        case "d":
            heldDownKeys.d = state;
            break;
        case " ":
        case "Spacebar":
            heldDownKeys.space = state;
            break;
    }
}

function GetDirectionNormalized(originX, originY, destinationX, destinationY)
{
    CheckTypeForNumber(originX);
    CheckTypeForNumber(originY);
    CheckTypeForNumber(destinationX);
    CheckTypeForNumber(destinationY);
    var distanceX = destinationX - originX;
    var distanceY = destinationY - originY;
    var totalDistance = Math.sqrt((distanceX * distanceX) + (distanceY * distanceY));

    var returnValue = 
    ({
        x : distanceX / totalDistance,
        y : distanceY / totalDistance
    })
    return returnValue;
}

var mainLoop = setInterval(RunLoop, 10);