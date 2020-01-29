/**
 * Base entity that is capable of being expanded with components.
 * @param {*} xPos 
 * @param {*} yPos 
 *
 *  @description Public methods
 * @method GetType()
 * @method GetWindow()
 * @method Coordinates()
 * @method SetCoordinates()
 * @method SetWindow()
 * @method GetName()
 * @method SetName(newName)
 * @method Destroy()
 * @method GetComponent(type)
 * @method FindComponentIndex(componentReference)
 * @method AddComponent(component)
 * @method RemoveComponent(componentIndex)
 */

var Entity = function(xPos, yPos)
{
    var type = "Entity";
    var componentArray = new Array();
    var coordX = xPos;
    var coordY = yPos;
    var rotation = 0.0; // Rotation in degrees - 0 being to the right side of the screen, 90 being up and so on.
    // Variables that are set by game window on creation.
    var window; // Set in creation function by game window.
    var name; // Name of entity;

    this.GetType = function()
    {
        return type;
    }
    this.GetWindow = function()
    {
        // console.log(window);
        return window;
    }
    this.Coordinates = function()
    {
        var coords = new function()
        {
            this.x = coordX;
            this.y = coordY;
            this.rotation = rotation;
        }
        return coords;
    }
    this.SetCoordinates = function(targetX, targetY)
    {
        coordX = targetX;
        coordY = targetY;
    }
    this.SetWindow = function(newWindow)
    {
        if (newWindow.GetType() != "Window")
        {
            console.log("Tried to switch entity window to non- window" + 
            "type. Cancelling switch.");
            return;
        }
        if (!window)
        {
            window = newWindow;
            return;
        }
        else
            console.log("Can't switch entity window... yet.");
        

    }
    this.GetName = function()
    {
        return name;
    }
    this.SetName = function(newName)
    {
        name = CheckTypeForString(newName);
    }
    /**
     * @function Destroy
     * @description Destroys entity and all of it's components.
     */
    this.Destroy = function()
    {
        if (window)
        {
            var myParentIndex = window.FindEntityIndex(this);
            if (myParentIndex != -1)
            {
                window.RemoveEntityByIndex(myParentIndex);
                return;
            }
        }
        // Destroy components.
        while (componentArray.length > 0)
        {
            this.RemoveComponent(componentArray.length-1);
        }
    }
    /**
     * @function GetComponent
     * @description Get component by type.
     * @returns {object} component or null
     */
    this.GetComponent = function(type)
    {
        for (var n = 0; n < componentArray.length; ++n)
        {
            // console.log(componentArray[n]);
            if (componentArray[n].GetType() == type)
                return componentArray[n];
        }
        return null;
    }
    // 
    /**
     * @param {*} componentReference Unique component instance ID
     * @description Finds component based on ID
     */
    this.FindComponentIndex = function(componentReference)
    {
        // Check inputted type.
        // Search component array for value.
        for (var n = 0; n < componentArray.length; ++n)
        {
            if (componentArray[n] == componentReference)
            {
                return n;
            }
        }
        return null;
    }
    /**
     * @function AddComponent
     * @description Adds component.
     * @param {object} component
     */
    this.AddComponent = function(component)
    {      
        var index = componentArray.push(component) - 1;
        componentArray[index].SetEntity(this);
        // console.log(componentArray[index]);
        // console.log(component.GetEntity());
        component.Start();
        return componentArray[index];
    }
    // Remove component in target index.
    // Returns: removed component reference.
    /**
     * @function RemoveComponent
     * @param {number} componentIndex 
     */
    this.RemoveComponent = function(componentIndex)
    {
        if (componentArray.length < 1)
        {
            console.log("Removing component failed: there are no components!");
            return;
        }
        var removedComponent = componentArray[componentIndex];
        console.log("Removed component:");
        console.log(removedComponent);
        // console.log("Entity " + name + " removing component " + removedComponent);
        for (var n = componentIndex; n < componentArray.length-1; ++n)
        {
            componentArray[n] = componentArray[n+1];
        }
        componentArray.pop();
        removedComponent.Destroy();
        
        return removedComponent;
    }

    return
    {
        lala: this.GetName()

    }
}

Entity.prototype.Start = function()
{

}

Entity.prototype.EntityTest = function()
{
    var testObject = new function()
    {
    }
    var returnValue;
    console.log("Running unit test for Entity.");
    console.log("");
    
    console.log("Testing Start()");
    console.log("Expected result: undefined");
    returnValue = this.Start();
    console.log("Returned: " + returnValue);
    console.log("");

    console.log("Testing AddComponent(testObject)");
    console.log("Expected result: object");
    returnValue = this.AddComponent(testObject);
    console.log("Returned: " + returnValue);
    PrintProperties(returnValue);
    console.log("")

    console.log("Testing GetComponent(testObject)");
    console.log("Expected result: object");
    returnValue = this.GetComponent(testObject);
    console.log("Returned: " + returnValue);
    PrintProperties(returnValue);
    console.log("")

    console.log("Testing FindComponentIndex(testObject)");
    console.log("Expected result: number");
    returnValue = this.FindComponentIndex(testObject);
    console.log("Returned: " + returnValue);
    PrintProperties(returnValue);
    console.log("")

    console.log("Testing RemoveComponent(0)");
    console.log("Expected result: object");
    returnValue = this.RemoveComponent(0);
    console.log("Returned: " + returnValue);
    PrintProperties(returnValue);
    console.log("")

    console.log("Testing Destroy()");
    console.log("Expected result: undefined");
    returnValue = this.Destroy();
    console.log("Returned: " + returnValue);
    PrintProperties(returnValue);
    console.log("")
}