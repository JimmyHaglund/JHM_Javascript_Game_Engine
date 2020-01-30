/**
 * @function WindowManager
 * @description Handles creation and management of rendering windows, as well as input and updates. Singleton.
 */
const windowManager = Object.create({
    /**@member {bool}*/
    drawDebug: false,
    windows: [],
    createWindow: function (windowXPos, windowYPos, windowWidth, windowHeight) {
        let index = this.windows.push(new Window(windowXPos, windowYPos,
            windowWidth, windowHeight)) - 1;
        this.windows[index].Start();
        return this.windows[index];
    },
    /**
     * @description Checks if a coordinate is inside any window's bounds. 
     * If so, returns the first window that fits the bill.
     * @function GetWindow
     * @param posX X-coordinate
     * @param posY Y-coordinate
     * @returns {function} gameWIndow
     */
    getWindow: function (posX, posY) {
        this.windows.forEach(window => {
            if (window.GetLeftSideCoord() <= posX &&
            window.GetRightSideCoord() >= posX) {
                if (window.GetTopSideCoord() <= posY &&
                window.GetBottomSideCoord() >= posY) {
                    return window;
                }
            }
        });
        return null;
    },
    render: function() {
        this.windows.forEach(window => {
            this.window.Render(drawDebug);
        });
    },
    /**
     * @description Checks point & returns relevant information regarding
     * what's on it, such as its position, colliders & window.
     * @function CheckPoint
     * @param {number} pointX
     * @param {number} pointY
     * @returns {pointInfo} pointInfo, contains: colliderComponents, gameWindow, 
     * posX, posY, windowLocalX, windowLocalY
    */
    checkPoint: function (pointX, pointY, ignoreCollider = null) {
        let pointInfo = {
            colliderComponents,
            gameWindow,
            posX: pointX,
            posY: pointY,
            windowLocalX,
            windowLocalY
        };

        pointInfo.gameWindow = getWindow(pointX, pointY);
        if (pointInfo.gameWindow != null) {
            pointInfo.windowLocalX = pointX - pointInfo.gameWindow.GetLeftSideCoord();
            pointInfo.windowLocalY = pointY - pointInfo.gameWindow.GetTopSideCoord();
            pointInfo.colliderComponents =
                pointInfo.gameWindow.CheckCollidersAtPoint(
                    pointInfo.windowLocalX, pointInfo.windowLocalY);
        }
        return pointInfo;
    },
    // Ends update loop.
    endLoop: function () {
        console.log("Ending window update loop");
        clearInterval(this.mainLoop);
    }
});

/**
 * @function UnitTest
 * @description Runs unit test for WindowManager.
 */
var WindowManagerTest = function () {
    var testObject = new function () {
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
    returnValue = WindowManager.CheckPoint(0, 0);
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