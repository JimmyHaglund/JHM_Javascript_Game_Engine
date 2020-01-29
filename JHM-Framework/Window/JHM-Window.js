/**
 * @class Window
 * @description Application window. Contains entities, answers to WindowManager.
 * @param {number} browserPositionX X-position of window's left side in browser.
 * @param {number} browserPositionY Y-position of window's top side in browser.
 * @param {number} width Pixel width of window.
 * @param {number} height Pixel height of window.
 *
 * @description Public methods
 * @method Start()
 * @method AddRenderComponent(component,priority)
 * @method Render()
 * @method AddEntity(coordX,coordY)
 * @method CheckCollidersAtPoint(coordX,coordY)
 * @method SetBackgroundColor(color)
 * @method GetLeftSideCoord()
 * @method GetRightSideCoord()
 * @method GetTopSideCoord()
 * @method GetBottomSideCoord()
 * @method GetHeight()
 * @method GetWidth()
 * @method Resize()
 * @method WindowTest()
 * @method GetColliderSets()
 */
/// <reference path="./JHM-Utility.js" />
/// <reference path="./JHM-Entity.js" />
var Window = function(browserPositionX, browserPositionY, width, height)
{
    // #region Private variables
    // Set window position and size.
    var browserPositionX = CheckTypeForNumber(browserPositionX);
    var browserPositionY = CheckTypeForNumber(browserPositionY);
    var width = CheckTypeForNumber(width);
    var height = CheckTypeForNumber(height);
    
    var renderArray = new Array(new Array()); // TODO: Add render priorities//layers//z axis.
    var colliderArray = new Array(); // Contains collider components.
    var renderLayerCounter = new Array();

    // Create canvas.
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");

    // Initialize entity array.
    var entityArray = new Array();
    var entityCount = 0;
    
    var color = "#B6B6B4"; // Window background color.

    var initialized = false; // Prevents running Start() twice.

    var type = "Window";
    //#endregion

    //#region public functions
    /**
     * @name Window#Start
     * @type {function}
     */ 
    this.Start = function()
    {
        // Prevent multiple initializations.
        if (initialized)
            return;
        initilized = true;

        canvas.width = width;
        canvas.height = height;

        canvas.style.left = browserPositionX;
        canvas.style.top = browserPositionY;

        document.body.insertBefore(canvas, document.body.childNodes[0]);
    }

    /** 
     * @function AddRenderComponent
     * @description Adds component to rendering cycle.
     * @param  {Object} component
     * @param {number} layer Render layer of new component higher = rendered over lower..
     */
    this.AddRenderComponent = function (component, layer = 0)
    {
        // if (layer == undefined) layer = 0;
        console.log("Adding sprite to layer: " + layer);
        // TODO: Add priority & layers.
        // console.log("Component: " + component + ". Layer: " + layer);
        var index = ArrayFindIndex(renderLayerCounter, layer);
        console.log("Index A: " + index);
        if (index === null)
        {
            index = this.AddRenderLayer(layer);
            ArrayInsert(renderArray, new Array(), index);
        }
        console.log("Index B: " + index);
        console.log("Layer counter: " + renderLayerCounter.length);
        renderArray[index].push(component);
        console.log(renderArray);
    }

    this.AddRenderLayer = function(layer)
    {
        if (renderLayerCounter.length == 0)
        {
            renderLayerCounter.push(layer);
            return 0;
        }
        for (var n = 0; n < renderLayerCounter.length; ++n)
        {
            var checkedLayer = renderLayerCounter[n];
            if (checkedLayer > layer)
            {
                ArrayInsert(renderLayerCounter, layer, n);
                return n;
            }
        }
        renderLayerCounter.push(layer);
        return renderLayerCounter.length-1;
    }

    this.RemoveRenderComponent = function(component)
    {
        var targetIndex = ArrayFindIndex(targetArray, component);
        if (targetIndex === null)
        {
            renderArray.shift
        }
        ArrayRemoveIndex(renderArray, targetIndex);
    }

    /**
     * @function Render
     * @description Renders visual content in window.
     */
    this.Render = function(debugEnabled)
    {
        // console.log("render array length: " + renderArray.length);
        // console.log("Rendering");
        Clear();
        for (var n = 0; n < renderArray.length; ++n)
        {
            for (var i = 0; i < renderArray[n].length; ++i)
            {
                // console.log("Rendering: " + n + "/" + i);
                renderArray[n][i].Render();
            }
        }
        // Debug draw functions.
        if (!debugEnabled)
            return;
        DrawCollisionBoxes();
    }

    /**
     * @function AddEntity
     * @description Creates an entity on the window and 
     *              returns pointer to the new entity.
     * @returns {Object} new entity
     */
    this.AddEntity = function(xPosition, yPosition)
    {
        try
        {
        var newEntityName = "Entity " + ++entityCount;
        var index = entityArray.push(new Entity(xPosition, yPosition)) - 1;
        entityArray[index].SetWindow(this);
        entityArray[index].SetName(newEntityName);
        entityArray[index].Start();
        
        return entityArray[index];
        }
        catch(err)
        {
            console.log("Error when adding entity: " + err);
            return null;
        }
    }
    /**
     * @function RemoveEntityByID
     * @description Removes entity with the given ID.
     * @param {*} entityID 
     */
    this.RemoveEntityByID = function(entityID)
    {
        var entityIndex = ArrayFindIndex(entityArray, entityID);
        this.RemoveEntityByIndex(entityIndex);
    }
    /**
     * @function RemoveEntityByIndex
     * @description Removes entity at index position. 
     * @param {*} targetIndex 
     */
    this.RemoveEntityByIndex = function(targetIndex)
    {
        if (entityIndex < 0)
        {
            console.log("Error when removing entity: entity index < 0");
            return;
        }
        var entity = entityArray[targetIndex];
        entity.Destroy();
        ArrayRemoveIndex(entityArray, targetIndex);
    }
    this.RemoveEntityWithoutKillingIt = function(entityID)
    {
        var entityIndex = ArrayFindIndex(entityArray, entityID);
        ArrayRemoveIndex(entityArray, targetIndex);
    }
    /**
     * @function FindEntityIndex
     * @description Returns index of given entity.
     */
    this.FindEntityIndex = function(entity)
    {
        var index = ArrayFindIndex(entityArray, entity);
        if (index == null)
            return -1;
        return index;
    };

    this.AddCollider = function(collider)
    {
        colliderArray.push(collider);
    };
    this.RemoveCollider = function(collider)
    {
        var targetIndex = ArrayFindIndex(colliderArray, collider);
        // console.log("Removing collider with index: " + targetIndex);
        ArrayRemoveIndex(colliderArray, targetIndex);
    };
    /**
     * @description Removes collider overlap.
     */
    this.BakeStaticColliders = function()
    {
        for (var n = 0; n < colliderArray.length; ++n)
        {
            var box = colliderArray[n].CollisionBox();

            var colTopLeft = this.CheckCollidersAtPoint(box.left, box.top, colliderArray[n]);
            var colTopRight = this.CheckCollidersAtPoint(box.right, box.top, colliderArray[n]);
            var colBottomLeft = this.CheckCollidersAtPoint(box.left, box.bottom, colliderArray[n]);
            var colBottomRight = this.CheckCollidersAtPoint(box.right, box.bottom, colliderArray[n]);

            // for (var i = 0; i < colTopLeft)
        }
    };

    /**
     * @function CheckCollidersAtPoint
     * @param {*} coordX 
     * @param {*} coordY 
     * @returns {Array} found colliders in an array.
     */
    this.CheckCollidersAtPoint = function(coordX, coordY, ignoreCollider = null)
    {
        // console.log("Mouse press detected in window. Coordinates x/y: " + posX + "/" + posY);
        var foundColliders = new Array();
        for (var n = 0; n < colliderArray.length; ++n)
        {
            if (colliderArray[n] === ignoreCollider) continue;
            var sideLeft = colliderArray[n].GetEntity().Coordinates().x + 
                    colliderArray[n].GetOffsetX(),
                sideTop = colliderArray[n].GetEntity().Coordinates().y + 
                    colliderArray[n].GetOffsetY(),
                sideRight = sideLeft + colliderArray[n].GetWidth(),
                sideBottom = sideTop + colliderArray[n].GetHeight();
            
            if (coordX > sideLeft && coordX < sideRight &&
                coordY > sideTop && coordY < sideBottom)
            {
                foundColliders.push(colliderArray[n]);
            }
        }
        // console.log(foundColliders);
        return foundColliders;
    }
    // TODO: Add collision layers support, add collision checks to WindowManager
    //       so it can be easily set-up & forgotten.
    // NOTE: Currently checks with the assumption that the collider is smaller, meaning that no collision will happen if a smaller collider goes directly through a  side without intersecting a corner.
    /**
     * @description Checks if target entity's collision component overlaps another entity's collision component.
     */
    this.CheckCollision = function(collidingEntity)
    {
        var collider = collidingEntity.GetComponent("ColliderComponent");
        if(!collider)
        {
            console.log("No collider found in requested collision check for entity.");
            return;
        }
        // console.log("Checking collision");

        for (var n = 0; n < colliderArray.length; ++n)
        {
            // console.log("Iteration: "+n );
            var other = colliderArray[n];
            if (other.GetEntity() == collidingEntity)
                continue;
            // Check vertical edges for overlap.
            if ((collider.CollisionBox().left >= other.CollisionBox().left && 
                collider.CollisionBox().left <= other.CollisionBox().right) ||
                (collider.CollisionBox().right >= other.CollisionBox().left && 
                collider.CollisionBox().right <= other.CollisionBox().right) ||

                // Check if other is inside this
                (collider.CollisionBox().left < other.CollisionBox().left && 
                collider.CollisionBox().right > other.CollisionBox().right) ||
                // Check if this is inside other
                (collider.CollisionBox().left > other.CollisionBox().left && 
                collider.CollisionBox().right < other.CollisionBox().right))
                {
                    // Check horizontal edges for overlap.
                    if ((collider.CollisionBox().top >= other.CollisionBox().top && 
                    collider.CollisionBox().top <= other.CollisionBox().bottom) ||
                    (collider.CollisionBox().bottom <= other.CollisionBox().bottom && 
                    collider.CollisionBox().bottom >= other.CollisionBox().top) ||
                
                     // Check if other is inside this
                    (collider.CollisionBox().top < other.CollisionBox().top && 
                    collider.CollisionBox().bottom > other.CollisionBox().bottom) ||
                    // Check if this is inside other
                    (collider.CollisionBox().top > other.CollisionBox().top && 
                    collider.CollisionBox().bottom < other.CollisionBox().bottom))
                    {
                        // console.log("Edge overlap found: " + other);
                        return other;
                    }
                }
        }
        return null;
    }

    /**
     * @function SetBackgroundColor
     * @description Sets window's background color.
     */
    this.SetBackgroundColor = function(color)
    {
        // TODO: create utility method for checking that color is valid.
        console.log("Setting canvas color.");
        color = color;
    }
    //#endregion

    //#region  GET/SET
    this.GetType = function()
    {
        return type;
    }

    this.GetContext = function()
    {
        return context;
    }

    /**
     * @function GetLeftSideCoord
     * @returns {number}
     */
    this.GetLeftSideCoord = function()
    {
        return browserPositionX;
    }
  
    /**
     * @function GetTopSideCoord
     * @returns {number}
     */
    this.GetTopSideCoord = function()
    {
        return browserPositionY;
    }
    /**
     * @function GetHeight
     * @returns {number}
     */
    this.GetHeight = function()
    {
        return height;
    }
    /**
     * @function GetWidth
     * @returns {number}
     */
    this.GetWidth = function()
    {
        return width;
    }
    /**
     * @function Resize
     * 
     * @param {number} newWidth 
     * @param {number} newHeight 
     */
    this.Resize = function(newWidth, newHeight)
    {
        width = CheckTypeForNumber(newWidth);
        height = CheckTypeForNumber(newHeight);
    }
    // Currently there are only box colliders. Some assumptions can be made as a result.
    this.GetColliderSets = function()
    {
        var colliderSets = new Array();
        for (var n = 0; n < colliderArray.length; ++n)
        {
            var col = colliderArray[n];
            // Top line
            var colliderSet = new Array();
            colliderSet.push(
                {
                    x : col.GetEntity().Coordinates().x + col.GetOffsetX(),
                    y : col.GetEntity().Coordinates().y + col.GetOffsetY()
                });
            
            colliderSet.push(
            {
                x : colliderSet[0].x + col.GetWidth(), 
                y : colliderSet[0].y
            });

            colliderSet.push(
            {
                x : colliderSet[1].x,
                y : colliderSet[1].y + col.GetHeight()
            });

            colliderSet.push(
            {
                x : colliderSet[0].x,
                y : colliderSet[2].y
            });
            /*
            {
                this.x = new Array();
                this.y = new Array();

                this.x.push();
                this.y.push();
                
                this.x.push(this.x[0]+col.GetWidth());
                this.y.push(this.y[0]);
                
                this.x.push(this.x[1]);
                this.y.push(this.y[1]+col.GetHeight());

                this.x.push(this.x[0]);
                this.y.push(this.y[2]);
            }
            */
            colliderSets.push(colliderSet);
        }
        return colliderSets;
    }
    //#endregion

    //#region Private functions
    /**
     * @function Clear
     * @description Clears window display.
     */
    var Clear = function()
    {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = color;
        context.fillRect(0, 0, canvas.width, canvas.height);
    }

    /**
     * @function DrawCollisionBoxes
     * @description Draws outlines of any collision boxes in window.
     *              Useful for debugging purposes.
     */
    var DrawCollisionBoxes = function()
    {
        for (var n = 0; n < colliderArray.length; ++n)
        {
            colliderArray[n].Draw();
        }
    }
    //#endregion
}
//#region Prototype functions
/**
 * @function GetRightSideCoord
 * @returns {number}
 */
Window.prototype.GetRightSideCoord = function()
{
    return this.GetLeftSideCoord() + this.GetWidth();
}

/**
 * @function GetBottomSideCoord
 * @returns {number}
 */
Window.prototype.GetBottomSideCoord = function()
{
    return this.GetTopSideCoord() + this.GetHeight();
}

/**
 * @function WindowTest
 * @description Runs unit test for Window.
 */
Window.prototype.WindowTest = function()
{
    var testObject = new function()
    {
    }
    var returnValue;
    console.log("Running unit test for Window.");
    console.log("");
    
    console.log("Testing Start()");
    console.log("Expected result: undefined");
    returnValue = this.Start();
    console.log("Returned: " + returnValue);
    console.log("");
    
    console.log("Testing AddRenderComponent(testObject, 10)");
    console.log("Expected result: undefined");
    returnValue = this.AddRenderComponent(testObject, 10);
    console.log("Returned: " + returnValue);
    console.log("");

    console.log("Testing Render()");
    console.log("Expected result: undefined");
    returnValue = this.Render();
    console.log("Returned: " + returnValue);
    PrintProperties(returnValue);
    console.log("");

    console.log("Testing AddEntity(0, 0)");
    console.log("Expected result: null");
    returnValue = this.AddEntity(0, 0);
    console.log("Returned: " + returnValue);
    PrintProperties(returnValue);
    console.log("");

    console.log("Testing CheckCollidersAtPoint(0, 0)");
    console.log("Expected result: Array[0]");
    returnValue = this.CheckCollidersAtPoint(0, 0);
    console.log("Returned: " + returnValue);
    PrintProperties(returnValue);
    console.log("");
}
//#endregion