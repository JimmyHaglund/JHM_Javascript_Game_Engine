/// <reference path="./JHM-Entity.js" />

/**
 * @class ColliderComponent
 * Adds collider to entity, allowing interaction with it.
 * @param {Number} desiredWidth 
 * @param {Number} desiredHeight 
 */
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
            var entity = this.GetEntity();
            var entityIndex = entity.FindComponentIndex(this);
            // If component isn't already removed from owner entity, remove it from entity & let entity call function.
            // This allows the component to be destroyed either by calling this 
            // method or by calling the parent entity's RemoveComponent directly.
            if ((entityIndex != null) && (entityIndex != -1))
            {
                // console.log("Removing component...");
                // console.log("Index: " + entityIndex);
                // console.log(entity.RemoveComponent(entityIndex));
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
            // console.log(XA);
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
        };
        this.SplitVertical = function(coordX)
        {
            var box = this.CollisionBox();
            if ((coordX < box.left) || (coordX > box.right)) return;
            var entity = this.GetEntity();
            var widthA = Math.abs(coordX - box.left);
            var offsetXA = offsetX;

            var widthB = Math.abs(box.right - coordX + 1);
            var offsetXB = offsetX  + widthA;

            var height = Math.abs(box.top - box.bottom);

            var a = entity.AddComponent(new ColliderComponent(widthA, height, offsetXA, this.GetOffsetY()));
            var b = entity.AddComponent(new ColliderComponent(widthB, height, offsetXB, this.GetOffsetY()));
            // console.log(entity.GetComponent())
            this.Destroy();
        };
        this.SplitHorizontal = function(coordY)
        {
            var box = this.CollisionBox();
            if ((coordY < box.top) || (coordY > box.bottom)) return;
            var entity = this.GetEntity();
            var heightA = Math.abs(coordY - box.top);
            var offsetYA = offsetY;

            var heightB = Math.abs(box.bottom - coordY + 1);
            var offsetYB = offsetY  + heightA;

            var width = Math.abs(box.right - box.left);

            entity.AddComponent(new ColliderComponent(width, heightA, this.GetOffsetX(), offsetYA));
            entity.AddComponent(new ColliderComponent(width, heightB, this.GetOffsetX(), offsetYB));
            this.Destroy();
        };
    };
    collidercomponent.prototype = new Component();

    var returnComponent = new collidercomponent();
    returnComponent.SetType("ColliderComponent");
    return returnComponent;
}


