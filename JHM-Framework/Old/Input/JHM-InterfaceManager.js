/**
 * Handles interface elements such as buttons. Singleton.
 */

/// <reference path="./JHM-Utility.js"/>
var InterfaceManager = new function()
{
    var buttonArray = new Array();
    var hoverButton;
    /**
     * @function AddButton
     * @description Adds button component to interface.
     * @param {*} button 
     * @returns {object}
     */
    this.AddButton = function(button)
    {
        var index = buttonArray.push(button) - 1;
        return buttonArray[index];
    }

    this.RemoveButton = function(buttonID)
    {
        var targetIndex = ArrayFindIndex(buttonArray, buttonID);
        ArrayRemoveIndex(buttonArray, targetIndex);
    }
    /**
     * @function CheckButtonPress
     * @description Check clickEvent colliders for button component. 
     * @param {clickEvent} clickEvent 
     */
    this.CheckButtonPress = function(clickEvent)
    {
        // Check for pressed button.
        if (!clickEvent.colliderComponents)
        {
            console.log("InterfaceManager.Checkbuttompress failed: " +
            "clickEvent has no colliderComponents property.");
            return;
        }    
        if (clickEvent.colliderComponents.length > 0)
        {
            var button = GetButtonAt(clickEvent);
            console.log("Button: " + button);
            if (button)
            {
                buttonArray.push(button);
                button.SetState(button.StateEnum.pressed);
            }
        }
    }

    /**
     * @function ReleaseButtonPress
     * @description Clears any pressed-down buttons.
     */
    this.ReleaseButtonPress = function()
    {
        for (var n = 0; n < buttonArray.length; ++n)
        {
            var button = buttonArray[buttonArray.length-1];
            button.InvokeOnPress();
            if (button == hoverButton)
            {
                button.SetState(button.StateEnum.hover);
            }
            else
            {
                button.SetState(button.StateEnum.normal);
            }
            buttonArray.pop();
        }
        
    }

    /**
     * @function GetButtonAt
     * @description Check clickEvent for a button component and returns it.
     * @param {*} clickEvent 
     */
    var GetButtonAt = function(clickEvent)
    {
        clickEvent = CheckTypeForObject(clickEvent);
        // Check for button.
        if (clickEvent.colliderComponents.length > 0)
        {
            for (var n = 0; n < clickEvent.colliderComponents.length; ++n)
            {
                var button = 
                clickEvent.colliderComponents[n].GetEntity().GetComponent("ButtonComponent");
                if (button)
                {
                    return button;
                }
                return null;
            }
        }
    }

    /**
     * @function CheckHover
     * @description Check if button is hovered over by clickevent.
     * @param {*} clickEvent 
     */
    this.CheckHover = function(clickEvent)
    {
        // console.log("Window " + clickEvent.gameWindow);   
        if (clickEvent.gameWindow == null)
            return;
        // console.log(clickEvent);
        var button = GetButtonAt(clickEvent);
        // console.log("Btn " +button);
        // Ignore if it's the same as previous frame
        if (button == hoverButton)
        {
            return;
        }
        else
        {
            // Change any previously hovered button from hover to normal sprite.
            if (hoverButton && hoverButton.GetState() == 2)
            {
                hoverButton.SetState(hoverButton.StateEnum.normal);
            }
            // Set new hover button.
            hoverButton = button;
            if (!button)
                return;
            button.SetState(button.StateEnum.hover);
        }
    }
}

var InterfaceManagerTest = function()
{
    var testObject = new function()
    {
    }
    var returnValue;
    console.log("Running unit test for InterfaceManager.");
    console.log("");
    
    console.log("Testing AddButton(testObject)");
    console.log("Expected result: object");
    returnValue = InterfaceManager.AddButton(testObject);
    console.log("Returned: " + returnValue);
    console.log(""); 

    console.log("Testing CheckButtonPress(testObject)");
    console.log("Expected result: undefined");
    returnValue = InterfaceManager.CheckButtonPress(testObject);
    console.log("Returned: " + returnValue);
    console.log("");

    console.log("Testing ReleaseButtonPress()");
    console.log("Expected result: object");
    returnValue = InterfaceManager.ReleaseButtonPress();
    console.log("Returned: " + returnValue);
    console.log(""); 

    console.log("Testing CheckHover(testObject)");
    console.log("Expected result: null");
    returnValue = InterfaceManager.CheckHover(testObject);
    console.log("Returned: " + returnValue);
    console.log(""); 
}