/**
 * Component to be added to entities.
 */
/*
/// <reference path="./JHM-Utility.js" />
function SpriteComponent(spriteID, layer = 0)
{
   CheckTypeForString(spriteID);

   // Public variables & functions
   let spritecomponent = function()
   {
       this.SetAlpha = function(desiredAlpha)
       {
           alpha = desiredAlpha;
       }
       this.SetSprite = function(targetSpriteID)
       {
           spriteID = targetSpriteID;
           if (spriteID == null) 
               return;
           image = document.getElementById(spriteID); // Document image.
           this.SetAlpha(alpha);
           imageWidth = image.naturalWidth;
           imageHeight = image.naturalHeight;
           cropWidth = imageWidth;
           cropHeight = imageHeight;
           cropOffsetX = 0;
           cropOffsetY = 0;
       }
       this.SetSprite(spriteID);
       this.GetSpriteID = function()
       {
           return spriteID;
       }
       // Initialization.
       this.Start = function()
       {
           // Add this component to list of entities to render.
           this.GetEntity().GetWindow().AddRenderComponent(this, 0);
       }
       // Clears this component's references & clears it from memory.
       this.Destroy = function()
       {
           var ID = this;
           var entityIndex = ID.gameEntity.FindComponentIndex(ID);
           // If component isn't already removed from owner entity, remove it from entity & let entity call function.
           if (entityIndex != -1)
           {
               ID.gameEntity.RemoveComponent(entityIndex);
               return;
           }
           else
           {
               entity.GetWindow().RemoveRenderComponent(this);
           }
       }
       /*
       this.SetEntity = function(value)
       {
           entity = value;
       }

       this.GetEntity = function()
       {
           return entity;
       }
       *//*
       // Render image.
       this.Render = function()
       {
           if (animating)
               NextAnimationFrame();
           // console.log("Rendering sprite");
           if (spriteID == null)
               return;
           var context = this.GetEntity().GetWindow().GetContext();
           var contextAlpha = context.globalAlpha;
           var offsetRange = Math.sqrt()
           // Rotate canvas to image's orientation.
           var offsetAngle = this.GetEntity().Coordinates().rotation;
           
           var totalOffsetX = imageWidth/2 + offsetX;
           var totalOffsetY = imageHeight/2 + offsetY;
           var translationX = 
               this.GetEntity().Coordinates().x +
               totalOffsetX * Math.cos(offsetAngle) -
               totalOffsetY * Math.sin(offsetAngle);
           var translationY =
               this.GetEntity().Coordinates().y + 
               totalOffsetY * Math.cos(offsetAngle) + 
               totalOffsetX * Math.sin(offsetAngle);
           
           context.translate(translationX, translationY);
           context.rotate(offsetAngle);
           // Set alpha of canvas to images' canvas.
           context.globalAlpha = alpha;
           // Render image to canvas.
           // console.log(image);
           context.drawImage(image,
               cropOffsetX,
               cropOffsetY,
               cropWidth,
               cropHeight,
               -imageWidth/2,
               -imageHeight/2,
               imageWidth,
               imageHeight);
           // Return alpha of canvas to default.
           context.globalAlpha = contextAlpha;
           // Return canvas rotation.
           context.rotate(-this.GetEntity().Coordinates().rotation);
           context.translate(-translationX, 
               -translationY);
       }
       // Set image offset from entity's position.
       this.SetOffset = function(newOffsetX, newOffsetY)
       {
           // Check types.
           try
           {
               CheckTypeForNumber(newOffsetX);
               CheckTypeForNumber(newOffsetY);
           }
           catch(err)
           {
               console.log("Error when setting offset: " + err);
               return;
           }
           // Set new offset.
           offsetX = newOffsetX;
           offsetY = newOffsetY;
       }

       this.Offset = 
       {
           x : offsetX,
           y : offsetY
       }
       // Scale image based on original image size.
       this.ScaleSizeByPercentage = function(scaleXPercentage, scaleYPercentage)
       {
           // Check types.
           try
           {
           scaleXPercentage = CheckTypeForNumber(scaleXPercentage);
           scaleXPercentage = CheckTypeForNumber(scaleYPercentage);
           }
           catch(err)
           {
               console.log("Error when scaling: " + err);
               return;
           }
           // Scale image.
           imageWidth = image.naturalWidth * scaleXPercentage * 0.01;
           imageHeight =image.naturalHeight * scaleYPercentage * 0.01;

           // Scale offset
       }

       this.ScaleSizeToPixels = function(desiredPixelWidth, desiredPixelHeight)
       {
           // Check types.
           try
           {
           desiredPixelWidth  = CheckTypeForNumber(desiredPixelWidth);
           desiredPixelHeight = CheckTypeForNumber(desiredPixelHeight);
           }
           catch(err)
           {
               console.log("Error when scaling: " + err);
               return;
           }
           // Scale image.
           imageWidth = desiredPixelWidth;
           imageHeight = desiredPixelHeight;
       }

       this.SetAnimationProperties = function(frames, animationTime, 
           imageSourceWidth, imageSourceHeight, columns, rows)
       {
           if (animationTime <= 0)
               animationTime = 1;
           spriteSheetFrames = frames;
           spriteAnimationSpeed = animationTime;
           cropWidth = imageSourceWidth;
           cropHeight = imageSourceHeight;
           spriteSheetColums = columns;
           spriteSheetRows = rows;
           currentAnimationFrame = 0;
       }

       this.StartAnimation = function()
       {
           animating = true;
       }

       this.StopAnimation = function()
       {
           animating = false;
       }

       /**
        * @method
        * Returns image size in pixels.
        */
       this.GetWidth = function()
       {
           return imageWidth;
       }
       
       this.GetHeight = function()
       {
           return imageHeight;
       }
       /*
       this.GetType = function()
       {
           return type;
       }
       *//*
   }

   // Private variables.

   var image;
   var alpha = 1;
   var imageWidth;
   var imageHeight;

   // Offset
   var offsetX = 0;
   var offsetY = 0;
   var offsetRange;

   // Image cropping
   var cropOffsetX = 0;
   var cropOffsetY = 0;
   var cropWidth = 0;
   var cropHeight = 0;

   // Sprite sheet options
   var spriteSheetFrames = 1;
   var spriteSheetRows = 1;
   var spriteSheetColums = 1;
   var spriteAnimationSpeed = 1;
   var currentAnimationFrame = 0;
   var lastAnimationFrame = 0;
   var animating = false;

   var ResetAnimation = function()
   {
       currentAnimationFrame = 0;
       lastAnimationFrame = 0;
       cropOffsetX = 0;
       cropOffsetY = 0;
   }
   var NextAnimationFrame = function()
   {
       // TODO: Rows & colums support.
       currentAnimationFrame += 1.0/spriteAnimationSpeed;
       if (currentAnimationFrame > spriteSheetFrames)
       {
           ResetAnimation();
           return;
       }
       
       if (currentAnimationFrame - lastAnimationFrame >= 1.0)
       {
           cropOffsetX = cropWidth * currentAnimationFrame;
           lastAnimationFrame += Math.floor(
               currentAnimationFrame - lastAnimationFrame);
       }
   }


   spritecomponent.prototype = new Component();
   var returnComponent = new spritecomponent();
   returnComponent.SetType("SpriteComponent");
   return returnComponent;
}*/