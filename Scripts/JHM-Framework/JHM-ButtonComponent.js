/**
 * Component to be added to entities.
 */

function ButtonComponent(spriteID, hoverID, pressedID, layer = 0)
{

    var defaultSpriteID = spriteID;
    var hoverSpriteID = hoverID;
    var pressedSpriteID = pressedID;
    var sprite;
    var collider;
    var onButtonPress = new JHMEvent();
    this.isInteractable = true;

    let buttoncomponent = function()
    {
        this.StateEnum = 
        {
            normal : 0,
            pressed : 1,
            hover : 2
        };
        // Initialization.
        this.Start = function()
        {
            sprite = this.GetEntity().AddComponent(new SpriteComponent(defaultSpriteID, layer));
            collider = this.GetEntity().AddComponent(new ColliderComponent(sprite.GetWidth(), sprite.GetHeight()));
            collider.SetOffset(sprite.GetOffset().x, sprite.GetOffset().y);
            collider.PrintProperties();
        }
        this.SetState = function(targetState)
        {
            if (this.isInteractable === false) 
            {
                sprite.SetSprite(defaultSpriteID);
                return;
            }
            switch (targetState)
            {
                case 0: // normal
                sprite.SetSprite(defaultSpriteID);
                break;
                case 1: // pressed
                sprite.SetSprite(pressedSpriteID);
                break;
                case 2: // hover
                sprite.SetSprite(hoverSpriteID);
                break;
            }
        }
        this.InvokeOnPress = function()
        {
            if (this.isInteractable === false) return;
            onButtonPress.Invoke();
        }
        this.AddOnPressDelegate = function(subscriber, eventArguments = null)
        {
            onButtonPress.AddSubscriber(subscriber, eventArguments);
        }
        this.RemoveOnPressDelegate = function(subscriber)
        {
            onButtonPress.RemoveSubscriber(subscriber);
        }
        this.GetState = function()
        {
            switch (sprite.GetSpriteID())
            {
                case pressedSpriteID: // pressed
                return 1;
                break;
                case hoverSpriteID: // hover
                return 2;
                break;
                case defaultSpriteID: // normal
                default:
                return 0;
                break;
            }
        }
        this.GetSprite = function()
        {
            return sprite;
        }
        // Clears this component's references & clears it from memory.
        this.Destroy = function()
        {
            var entityIndex = entity.FindComponentIndex(this);
            if (entityIndex != -1)
            {
                entity.RemoveComponent(entityIndex);
                return;
            }
            {
                InterfaceManager.RemoveButton(this);
            }
        }

    }
    buttoncomponent.prototype = new Component();

    var returnComponent = new buttoncomponent();
    returnComponent.SetType("ButtonComponent");
    return returnComponent;
}

ButtonComponent.prototype.ButtonTest = function()
{
    var testObject = new function()
    {
    }
    var returnValue;
    console.log("Running unit test for ButtonComponent.");
    console.log("");
    
    console.log("Testing Start()");
    console.log("Expected result: undefined");
    returnValue = this.Start();
    console.log("Returned: " + returnValue);
    console.log("");

    console.log("Testing Destroy()");
    console.log("Expected result: undefined");
    returnValue = this.Destroy();
    console.log("Returned: " + returnValue);
    PrintProperties(returnValue);
    console.log("")

}