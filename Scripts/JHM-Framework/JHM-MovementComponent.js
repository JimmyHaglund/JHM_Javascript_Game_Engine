/**
 * Component to be added to entities.
 */

function MovementComponent()
{
    var speed = { x : 0, y : 0 };
    // Public
    var movementcomponent = function()
    {
        this.Move = function(moveX, moveY)
        {
            CheckTypeForNumber(moveX);
            CheckTypeForNumber(moveY);
            moveX += speed.x;
            moveY += speed.y;
            // console.log("Moving: " + moveX + " / " + moveY);
            var entityCoords = this.GetEntity().Coordinates();
            this.GetEntity().SetCoordinates(
                entityCoords.x + moveX,
                entityCoords.y + moveY);
        }
        
        this.SetSpeed = function(speedX, speedY)
        {
            speed.x = speedX;
            speed.y = speedY;
        }
    }
    movementcomponent.prototype = new Component();
    var returnComponent = new movementcomponent();
    returnComponent.SetType("MovementComponent");
    return returnComponent;

}