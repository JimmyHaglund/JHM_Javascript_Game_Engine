/**
 * @function WindowManager
 * @description Handles creation and management of game windows, as well as input and updates. Singleton.
 */
/// <reference path="./JHM-Utility.js"/>
/// <reference path="./JHM-Window.js"/>
var WindowManager = new function()
{
    /**@member {bool}*/
    this.drawDebug = true;

    // Initialize window array.
    var windowArray = new Array();

    /**
     * @description Updates window's internal logic.
     * @function UpdateLogic
     */
    this.UpdateLogic = function()
    {
        
    }
    /** 
     * @description Renders window contents.
     * @function Render
     */
    this.Render = function()
    {
        for (var n = 0; n < windowArray.length; ++n)
        {
            windowArray[n].Render(this.drawDebug);
        }
    }
    
    /**
     * @description Checks point & returns relevant information regarding
     * what's on it, such as its position, colliders & window.
     * @function CheckPoint
     * @param {number} pointX
     * @param {number} pointY
     * @returns {pointInfo} pointInfo, contains: colliderComponents, gameWindow, 
     * posX, posY, windowLocalX, windowLocalY
    */ 
    this.CheckPoint = function(pointX, pointY)
    {
        if (pointX == undefined || pointY == undefined)
        throw "pointX & pointY must be assigned valid values."
        pointX = CheckTypeForNumber(pointX);
        pointY = CheckTypeForNumber(pointY);
        /// Check for mouse clicks in open game windows.
        /// If a window is pressed, convert mouse coordinates to window's
        /// local coords and send a mouse press call to it.
        /**
         * @function pointInfo
         * @description Contains info aboot colliders and game window at a point.
         */
        var pointInfo = new function()
        {
            this.colliderComponents;
            this.gameWindow;
            this.posX = pointX;
            this.posY = pointY;
            this.windowLocalX;
            this.windowLocalY;
        }
        
        pointInfo.gameWindow = GetWindow(pointX, pointY);
        if (pointInfo.gameWindow != null)
        {
            pointInfo.windowLocalX = pointX - pointInfo.gameWindow.GetLeftSideCoord();
            pointInfo.windowLocalY = pointY - pointInfo.gameWindow.GetTopSideCoord();
            
            pointInfo.colliderComponents = 
            pointInfo.gameWindow.CheckCollidersAtPoint(
                pointInfo.windowLocalX, pointInfo.windowLocalY);
        }
        return pointInfo;
    }
    /**
     * @description Checks if a window is at coordinates.
     * @function GetWindow
     * @param posX X-coordinate
     * @param posY Y-coordinate
     * @returns {function} gameWIndow
     */ 
    var GetWindow = function(posX, posY)
    {
        for (var i = 0; i < windowArray.length; ++i)
        {
            // console.log(i);
            if (windowArray[i].GetLeftSideCoord() <= posX && 
                windowArray[i].GetRightSideCoord() >= posX)
            {
                if (windowArray[i].GetTopSideCoord() <= posY &&
                    windowArray[i].GetBottomSideCoord() >= posY)
                    {
                        return windowArray[i];
                    }
            }
        }
        return null;
    }
    

    // Ends update loop.
    this.EndLoop = function()
    {
        console.log("Ending loop");
        clearInterval(this.mainLoop);
    }

    /**
     * Adds a window to browser.
     * @param {number} windowXPos 
     * @param {number} windowYPos 
     * @param {number} windowWidth 
     * @param {number} windowHeight 
     * @returns {Window}
     */
    this.AddWindow = function(windowXPos, windowYPos, windowWidth, windowHeight)
    {
        var index = windowArray.push(new Window(windowXPos, windowYPos,
            windowWidth, windowHeight)) - 1;
        windowArray[index].Start();
        return windowArray[index];
    }
}
/**
 * @function UnitTest
 * @description Runs unit test for WindowManager.
 */
var WindowManagerTest = function()
{
    var testObject = new function()
    {
    }
    var returnValue;
    console.log("Running unit test for WindowManager.");
    console.log("");
    
    console.log("Testing UpdateLogic()");
    console.log("Expected result: undefined");
    returnValue = WindowManager.UpdateLogic();
    console.log("Returned: " + returnValue);
    console.log("");
    
    console.log("Testing Render()");
    console.log("Expected result: undefined");
    returnValue = WindowManager.Render();
    console.log("Returned: " + returnValue);
    console.log("");

    console.log("Testing CheckPoint(0, 0)");
    console.log("Expected result: Object");
    returnValue = WindowManager.CheckPoint(0,0);
    console.log("Returned: " + returnValue);
    PrintProperties(returnValue);
    console.log("");

    console.log("Testing AddWindow(0, 0, 10, 10)");
    console.log("Expected result: Object");
    returnValue = WindowManager.AddWindow(0, 0, 10, 10);
    console.log("Returned: " + returnValue);
    PrintProperties(returnValue);
    console.log("");
}