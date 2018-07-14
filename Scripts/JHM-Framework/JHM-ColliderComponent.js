/**
 * @file ColliderComponent.js
 * Adds collider to entity, allowing interaction with it.
 * @param {Number} desiredWidth 
 * @param {Number} desiredHeight 
 */
/// <reference path="./JHM-Entity.js" />

 //TODO: Refactor. Looks very different from other scripts, probably need to be updated.
function ColliderComponent(desiredWidth, desiredHeight, desiredOffsetX = 0, desiredOffsetY = 0)
{   
    // Filter input value types and set box size.
    var width = CheckTypeForNumber(desiredWidth);
    var height = CheckTypeForNumber(desiredHeight);
    var offsetX = CheckTypeForNumber(desiredOffsetX);
    var offsetY = CheckTypeForNumber(desiredOffsetY);
    // #region Getters & Setters.
    
    var collidercomponent = function()
    {
        this.Start = function()
        {
            // Add collider to list of colliders in window.
            this.GetEntity().GetWindow().AddCollider(this);
        }
        /**
         * @method
         * Destroys component & removes
         * references to it in parents.
         */
        this.Destroy = function()
        {
            var entityIndex = entity.FindComponentIndex(this);
            // If component isn't already removed from owner entity, remove it from entity & let entity call function.
            // This allows the component to be destroyed either by calling this 
            // method or by calling the parent entity's RemoveComponent directly.
            if (entityIndex != -1)
            {
                entity.RemoveComponent(entityIndex);
                return;
            }
            // Once component is removed from entity component list, remove from collider array.
            {
                entity.GetWindow().RemoveCollider(this);
            }
        }

        /**
         * @method
         * Sets size of hit box in pixels.
         * @param {Number} newWidth 
         * @param {Number} newHeight 
         */
        this.SetSize = function(newWidth, newHeight)
        {
            width = CheckTypeForNumber(newWidth);
            height = CheckTypeForNumber(newHeight);
            UpdateBox();
        }
        /**
         * @method
         * Returns box width in pixels.
         */

        this.GetWidth = function()
        {
            return width;
        }
        /**
         * @method
         * Returns box height in pixels.
         */
        this.GetHeight = function()
        {
            return height;
        }

        /**
         * @method
         * Sets offset of boxe's top - right corner
         * from parent entity's coordinates.
         * @param {Number} newOffsetX 
         * @param {Number} newOffsetY 
         */
        this.SetOffset = function(newOffsetX, newOffsetY)
        {
            offsetX = CheckTypeForNumber(newOffsetX);
            offsetY = CheckTypeForNumber(newOffsetY);
        }
        this.GetOffsetX = function()
        {
            return offsetX;
        }
        this.GetOffsetY = function()
        {
            return offsetY;
        }

        /**
         * @method
         * Prints collider properties to console.
         */
        this.PrintProperties = function()
        {
            console.log("--------------------")
            console.log("Collider belonging to " + this.GetEntity().name + ":");
            console.log("Position X / Y: " + this.GetEntity().coordX + " / " +
            this.GetEntity().coordY);
            console.log("Width / Height: " + this.GetWidth() + " / " + 
            this.GetHeight());
            console.log("Offset X / Y:" + this.GetOffsetX() + " / " + 
            this.GetOffsetY());
            console.log("--------------------")
        }
        this.Draw = function()
        {
            var context = this.GetEntity().GetWindow().GetContext();
            context.beginPath();
            var XA = this.GetEntity().Coordinates().x + offsetX;
            var XB = XA + width;
            var YA = this.GetEntity().Coordinates().y + offsetY;
            var YB = YA + height;
            // console.log(XA +" " + YA);
            // console.log(XB + " " + YB)
            context.moveTo(XA,YA);
            context.lineTo(XB,YA);
            context.lineTo(XB,YB);
            context.lineTo(XA,YB);
            context.lineTo(XA,YA);
            context.stroke();
        }

        this.CollisionBox = function()
        {
            return (
            {
                left : this.GetEntity().Coordinates().x + offsetX,
                right : this.GetEntity().Coordinates().x + offsetX + width,
                top : this.GetEntity().Coordinates().y + offsetY,
                bottom : this.GetEntity().Coordinates().y + offsetY + height
            })
        }
    }
    collidercomponent.prototype = new Component();

    var returnComponent = new collidercomponent();
    returnComponent.SetType("ColliderComponent");
    return returnComponent;
}


