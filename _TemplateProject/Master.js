/**
 * @file
 * Creates and manipulates game according to customization.
 * TODO: Clear out Gijsjerts dependency
 * TODO: Convert all functions in here into subscribable events
 *
 */

// System variables.
var debugModeEnabled = true;

// Window variables

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
var testImage = null;
var testEntity = null;
var testBox = null;
var rayAX = 0, rayAY = 0;
var mousePosText;
var mouseTextArray;
var mesh;
var testTriangle;

var OnStart = new JHMEvent();

function Start()
{
    // Create event objects
    // OnStart.AddSubscriber();
    OnStart.Add(console.log(new One().get()));
    OnStart.Invoke();

    // Create game window.
    gameWindow = WindowManager.AddWindow(
        gameWindowWidth*0.15,
        gameWindowHeight*0.15,
        gameWindowWidth, 
        gameWindowHeight);
    gameWindow.SetBackgroundColor("#33ccff");
    
    // GenerateBorderTriangles(gameWindow);

    // var preload = document.getElementById("preload");
    // testImage = gameWindow.AddEntity(50, 50);

    // testEntity = gameWindow.AddEntity(gameWindow.GetWidth()*0.5, gameWindow.GetHeight()*0.5);
    // testBox = testEntity.AddComponent(new ColliderComponent(100, 100));
    /*
    for (var n = 0; n < 5; ++n)
    {
        var stringArray = new Array();
        stringArray.push (n);
        var iterativeEntity = gameWindow.AddEntity(Math.random()* gameWindow.GetWidth(), Math.random() * gameWindow.GetHeight());
        var iterativeBox = iterativeEntity.AddComponent(new ColliderComponent(Math.random() * 250, Math.random() * 250));
        ColliderToTriangle(iterativeBox);
        var txt = iterativeEntity.AddComponent(new TextComponent(stringArray));
    }
    */

    // testTriangle = GenerateTestTriangle(gameWindow);
    // AddTriangleDebug(gameWindow, testTriangle);
    // TriangleTest_IsInteracting();

    // var mouseTextEntity = gameWindow.AddEntity(10, 50);
    // mouseTextArray = new Array();
    // mouseTextArray.push (0);
    // mouseTextArray.push("/");
    // mouseTextArray.push (0);
    // mousePosText = mouseTextEntity.AddComponent(new TextComponent(mouseTextArray));

    // colSets = gameWindow.GetColliderSets();
    // console.log("collider sets: " + colSets);
    // console.log(colSets[0].x);
    // UpdateRayColliders();
}

// Run when mouse is pressed down.
function AcceptMousePress(event)
{
    // testSprite.SetSprite("SpriteA");


    var clickEvent = WindowManager.CheckPoint(event.clientX, event.clientY);
    // console.log(clickEvent.gameWindow);
    InterfaceManager.CheckButtonPress(clickEvent);
    rayAX = clickEvent.windowLocalX;
    rayAY = clickEvent.windowLocalY;
}
// Run when mouse button is released.
function AcceptMouseRelease(event)
{
    var clickEvent = WindowManager.CheckPoint(event.clientX, event.clientY);
    InterfaceManager.ReleaseButtonPress();
    // clickEvent.colliderComponents[0].SplitVertical(clickEvent.windowLocalX);
    // clickEvent.colliderComponents[0].SplitHorizontal(clickEvent.windowLocalY);
    // new Ray(rayAX, rayAY, clickEvent.windowLocalX, clickEvent.windowLocalY, 5000);
    
}
var mX, mY;
// Run whenever mouse is moved.
function MouseMove(event)
{
    var clickEvent = WindowManager.CheckPoint(event.clientX, event.clientY);
    InterfaceManager.CheckHover(clickEvent);
    mX = clickEvent.windowLocalX;
    mY = clickEvent.windowLocalY;
    // mouseTextArray[0] = mX;
    // mouseTextArray[2] = mY;
    // mousePosText.SetText(mouseTextArray);
    // UpdateRay(clickEvent);
    // new Ray(rayAX, rayAY, clickEvent.windowLocalX, clickEvent.windowLocalY, 1);
}
    
// Periodic update. Render & update logic.
function RunLoop()
{
    WindowManager.UpdateLogic();
    WindowManager.Render(debugModeEnabled);
    RayTick();
}

function AcceptKeyPress(event)
{
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